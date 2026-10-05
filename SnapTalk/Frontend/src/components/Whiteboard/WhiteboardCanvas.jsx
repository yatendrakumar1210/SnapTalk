import React, { useRef, useEffect, useState } from 'react';
import WhiteboardToolbar from './WhiteboardToolbar';
import { useSocket } from '../../context/SocketContext';

const WhiteboardCanvas = ({ meetingId, isHost, studentDrawingEnabled }) => {
  const { socket } = useSocket();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [pages, setPages] = useState([{ id: 'page_1', title: 'Board 1', elements: [] }]);
  const [activePageId, setActivePageId] = useState('page_1');

  const historyRef = useRef([]); // undo history
  const canDraw = isHost || studentDrawingEnabled;

  useEffect(() => {
    if (socket && meetingId) {
      socket.emit('whiteboard:join', { meetingId });

      const onDrawRemote = (operation) => {
        applyRemoteOperation(operation);
      };

      const onClearRemote = ({ pageId }) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };

      socket.on('whiteboard:draw', onDrawRemote);
      socket.on('whiteboard:clear', onClearRemote);

      return () => {
        socket.off('whiteboard:draw', onDrawRemote);
        socket.off('whiteboard:clear', onClearRemote);
      };
    }
  }, [socket, meetingId]);

  // Adjust canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, []);

  const applyRemoteOperation = (op) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.strokeStyle = op.color || '#000000';
    ctx.fillStyle = op.color || '#000000';
    ctx.lineWidth = op.strokeWidth || 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (op.type === 'pen' || op.type === 'highlighter' || op.type === 'eraser') {
      if (op.type === 'highlighter') {
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = (op.strokeWidth || 3) * 3;
      } else if (op.type === 'eraser') {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = (op.strokeWidth || 3) * 4;
      }

      ctx.beginPath();
      ctx.moveTo(op.points[0].x, op.points[0].y);
      for (let i = 1; i < op.points.length; i++) {
        ctx.lineTo(op.points[i].x, op.points[i].y);
      }
      ctx.stroke();
    } else if (op.type === 'rectangle') {
      ctx.strokeRect(op.x, op.y, op.width, op.height);
    } else if (op.type === 'circle') {
      ctx.beginPath();
      ctx.arc(op.x, op.y, op.radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (op.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(op.x1, op.y1);
      ctx.lineTo(op.x2, op.y2);
      ctx.stroke();
    } else if (op.type === 'text') {
      ctx.font = `${(op.strokeWidth || 3) * 6}px sans-serif`;
      ctx.fillText(op.text, op.x, op.y);
    }

    ctx.restore();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const currentPointsRef = useRef([]);

  const handleMouseDown = (e) => {
    if (!canDraw) return;
    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(pos);
    currentPointsRef.current = [pos];

    if (tool === 'text') {
      const input = prompt('Enter text:');
      if (input) {
        const op = { type: 'text', text: input, x: pos.x, y: pos.y, color, strokeWidth };
        applyRemoteOperation(op);
        if (socket) socket.emit('whiteboard:draw', { meetingId, operation: op });
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !canDraw) return;
    const pos = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      const prev = currentPointsRef.current[currentPointsRef.current.length - 1];
      ctx.save();
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = tool === 'highlighter' ? strokeWidth * 3 : (tool === 'eraser' ? strokeWidth * 4 : strokeWidth);
      if (tool === 'highlighter') ctx.globalAlpha = 0.3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.restore();

      currentPointsRef.current.push(pos);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !canDraw) return;
    const pos = getCanvasCoords(e);
    setIsDrawing(false);

    let op = null;
    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      op = {
        type: tool,
        points: currentPointsRef.current,
        color,
        strokeWidth
      };
    } else if (tool === 'rectangle') {
      op = {
        type: 'rectangle',
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(pos.x - startPos.x),
        height: Math.abs(pos.y - startPos.y),
        color,
        strokeWidth
      };
      applyRemoteOperation(op);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      op = {
        type: 'circle',
        x: startPos.x,
        y: startPos.y,
        radius,
        color,
        strokeWidth
      };
      applyRemoteOperation(op);
    } else if (tool === 'line') {
      op = {
        type: 'line',
        x1: startPos.x,
        y1: startPos.y,
        x2: pos.x,
        y2: pos.y,
        color,
        strokeWidth
      };
      applyRemoteOperation(op);
    }

    if (op && socket) {
      socket.emit('whiteboard:draw', { meetingId, operation: op });
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (socket) socket.emit('whiteboard:clear', { meetingId, pageId: activePageId });
  };

  const handleAddPage = () => {
    const newPage = { id: `page_${pages.length + 1}`, title: `Board ${pages.length + 1}`, elements: [] };
    const updated = [...pages, newPage];
    setPages(updated);
    setActivePageId(newPage.id);
    handleClear();
    if (socket) socket.emit('whiteboard:page-change', { meetingId, pageId: newPage.id, pages: updated });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 overflow-hidden relative">
      <WhiteboardToolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={() => {}}
        onRedo={() => {}}
        onClear={handleClear}
        canDraw={canDraw}
        pages={pages}
        activePageId={activePageId}
        onSelectPage={(id) => {
          setActivePageId(id);
          handleClear();
        }}
        onAddPage={handleAddPage}
      />
      <div className="flex-1 relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full bg-white dark:bg-gray-900 block"
        />
      </div>
    </div>
  );
};

export default WhiteboardCanvas;

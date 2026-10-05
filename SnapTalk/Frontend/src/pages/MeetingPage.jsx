import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PreJoinScreen from '../components/Meeting/PreJoinScreen';
import MeetingRoom from '../components/Meeting/MeetingRoom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MeetingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const [joinOptions, setJoinOptions] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await api.get(`/meetings/${meetingId}`);
        if (res.success && res.meeting) {
          setMeeting(res.meeting);
        } else {
          setError('Meeting not found or has ended.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load meeting details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  const handleJoin = (options) => {
    setJoinOptions(options);
    setJoined(true);
  };

  const handleLeave = () => {
    setJoined(false);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center shadow-xl">
          <h2 className="text-xl font-bold text-red-400 mb-2">Meeting Error</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm"
          >
            Back to SnapTalk
          </button>
        </div>
      </div>
    );
  }

  if (!joined) {
    return (
      <PreJoinScreen
        meetingId={meetingId}
        meetingTitle={meeting?.title}
        initialName={user?.name || ''}
        passcodeRequired={Boolean(meeting?.passcode)}
        onJoin={handleJoin}
      />
    );
  }

  return (
    <MeetingRoom
      meetingId={meetingId}
      meeting={meeting}
      joinOptions={joinOptions}
      onLeave={handleLeave}
    />
  );
};

export default MeetingPage;

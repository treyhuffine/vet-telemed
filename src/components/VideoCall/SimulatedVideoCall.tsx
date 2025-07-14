'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDemoData } from '@/context/DemoData';
import { useVetAuth } from '@/context/VetAuth';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  User,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SimulatedVideoCallProps {
  caseId: string;
}

export default function SimulatedVideoCall({ caseId }: SimulatedVideoCallProps) {
  const router = useRouter();
  const { user } = useVetAuth();
  const { 
    getCase, 
    getActiveCall, 
    startVideoCall, 
    joinVideoCall, 
    endVideoCall,
    toggleScreenShare,
    subscribeToUpdates 
  } = useDemoData();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [activeCall, setActiveCall] = useState<any>(null);

  const caseData = getCase(caseId);

  useEffect(() => {
    if (!user || !caseId) return;

    // Check if there's an active call
    let call = getActiveCall(caseId);
    
    if (!call) {
      // Start a new call
      call = startVideoCall(caseId, user.id);
      toast.success('Video call started');
    } else {
      // Join existing call
      joinVideoCall(call.id, user.id);
      toast.info('Joined existing call');
    }
    
    setActiveCall(call);
    setParticipants(call.participants);

    // Subscribe to call updates
    const unsubscribe = subscribeToUpdates((type, data) => {
      if (type === 'video_call_updated' && data.id === call?.id) {
        setParticipants(data.updates.participants || call.participants);
        if (data.updates.screenShare) {
          setIsScreenSharing(data.updates.screenShare.userId === user.id && data.updates.screenShare.isActive);
        }
      }
      if (type === 'video_call_ended' && data.id === call?.id) {
        toast.info('Call ended');
        router.push('/dashboard');
      }
    });

    // Update call duration
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [caseId, user]);

  const handleEndCall = () => {
    if (activeCall) {
      endVideoCall(activeCall.id);
      toast.success('Call ended');
      router.push('/dashboard');
    }
  };

  const handleToggleScreenShare = () => {
    if (activeCall) {
      toggleScreenShare(activeCall.id, user!.id);
      setIsScreenSharing(!isScreenSharing);
      toast.info(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!caseData) {
    return <div>Case not found</div>;
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold">Video Consultation</h1>
          <Badge variant="outline" className="text-white border-white">
            {caseData.petName} - {caseData.chiefComplaint}
          </Badge>
          <span className="text-gray-300 text-sm">{formatDuration(callDuration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-300" />
          <span className="text-gray-300 text-sm">{participants.length} participants</span>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 relative bg-black">
        {/* Simulated video feed */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Video className="h-24 w-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Simulated Video Feed</p>
            <p className="text-gray-500 text-sm">
              {user?.role === 'vet' ? 'Vet Tech Camera View' : 'Veterinarian Camera View'}
            </p>
            {isScreenSharing && (
              <Badge className="mt-4 bg-blue-600">Screen Sharing Active</Badge>
            )}
          </div>
        </div>

        {/* Self view */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{user?.name}</p>
              {!isVideoOn && <p className="text-gray-500 text-xs">Camera Off</p>}
            </div>
          </div>
        </div>

        {/* Participant indicators */}
        <div className="absolute top-4 right-4 space-y-2">
          {participants.filter(p => p !== user?.id).map(participantId => (
            <Card key={participantId} className="bg-gray-800 text-white px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">
                  {participantId === 'tech-1' ? 'Vet Tech' : 'Dr. Johnson'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            className="rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            variant={!isVideoOn ? "destructive" : "secondary"}
            size="lg"
            className="rounded-full"
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {!isVideoOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>

          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="rounded-full"
            onClick={handleToggleScreenShare}
          >
            {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full"
            onClick={() => toast.info('Chat feature coming soon')}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="rounded-full px-8"
            onClick={handleEndCall}
          >
            <Phone className="h-5 w-5 mr-2" />
            End Call
          </Button>
        </div>
      </div>
    </div>
  );
}
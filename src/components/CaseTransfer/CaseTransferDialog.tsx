'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserCheck,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import { mockUsers } from '@/constants/mocks';
import { Case } from '@/types';
import { useRealtimeStaffAvailability } from '@/hooks/useRealtimeQueue';

interface CaseTransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  onTransfer: (toVetId: string, reason: string) => void;
}

export default function CaseTransferDialog({
  isOpen,
  onClose,
  currentCase,
  onTransfer,
}: CaseTransferDialogProps) {
  const [selectedVetId, setSelectedVetId] = useState<string>('');
  const [transferReason, setTransferReason] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const availableStaffIds = useRealtimeStaffAvailability();

  // Get available vets (excluding current assigned vet)
  const availableVets = mockUsers.filter(
    user => 
      user.role === 'vet' && 
      user.id !== currentCase.assignedVetId &&
      availableStaffIds.includes(user.id)
  );

  const unavailableVets = mockUsers.filter(
    user => 
      user.role === 'vet' && 
      user.id !== currentCase.assignedVetId &&
      !availableStaffIds.includes(user.id)
  );

  const handleTransfer = async () => {
    if (!selectedVetId || !transferReason.trim()) return;

    setIsTransferring(true);
    // Simulate transfer delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onTransfer(selectedVetId, transferReason);
    setIsTransferring(false);
    onClose();
  };

  const getVetCaseload = (vetId: string) => {
    // In real app, this would calculate from real-time data
    return Math.floor(Math.random() * 5) + 1;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transfer Case</DialogTitle>
          <DialogDescription>
            Select a veterinarian to transfer this case to. The new vet will be notified immediately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Current Case Info */}
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Case:</strong> {currentCase.id} - {currentCase.chiefComplaint}
              <br />
              <strong>Triage Level:</strong>{' '}
              <span className={`font-medium ${
                currentCase.triageLevel === 'red' ? 'text-red-600' :
                currentCase.triageLevel === 'yellow' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {currentCase.triageLevel.toUpperCase()}
              </span>
            </AlertDescription>
          </Alert>

          {/* Available Vets */}
          <div className="space-y-3">
            <Label>Select Veterinarian</Label>
            {availableVets.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No other veterinarians are currently available. Please try again later.
                </AlertDescription>
              </Alert>
            ) : (
              <RadioGroup value={selectedVetId} onValueChange={setSelectedVetId}>
                <div className="space-y-2">
                  {availableVets.map((vet) => {
                    const caseload = getVetCaseload(vet.id);
                    return (
                      <label
                        key={vet.id}
                        htmlFor={`vet-${vet.id}`}
                        className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                      >
                        <RadioGroupItem value={vet.id} id={`vet-${vet.id}`} />
                        <Avatar>
                          <AvatarImage src={vet.avatarUrl} />
                          <AvatarFallback>
                            {vet.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{vet.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {caseload} active {caseload === 1 ? 'case' : 'cases'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {vet.specializations?.join(', ') || 'General Practice'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <UserCheck className="h-4 w-4" />
                          <span className="text-sm">Available</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </RadioGroup>
            )}

            {/* Show unavailable vets */}
            {unavailableVets.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Currently Unavailable:</p>
                <div className="space-y-1">
                  {unavailableVets.map((vet) => (
                    <div key={vet.id} className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{vet.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transfer Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Transfer</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a brief reason for the transfer..."
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isTransferring}>
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer} 
            disabled={!selectedVetId || !transferReason.trim() || isTransferring}
          >
            {isTransferring ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Transfer Case
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
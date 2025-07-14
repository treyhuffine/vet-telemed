'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Send,
  CheckCircle
} from 'lucide-react';
import { safeAsync } from '@/lib/error-handling';
import { useVetAuth } from '@/context/VetAuth';

interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'other';
  rating: 'positive' | 'neutral' | 'negative';
  message: string;
  userEmail?: string;
  userId?: string;
  page?: string;
}

export default function FeedbackWidget() {
  const { user } = useVetAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    type: 'improvement',
    rating: 'neutral',
    message: '',
    userEmail: user?.email,
    userId: user?.id,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  });

  const handleSubmit = async () => {
    if (!feedbackData.message.trim()) return;

    await safeAsync(async () => {
      setIsSubmitting(true);
      
      // In production, this would send to your feedback API
      console.log('Submitting feedback:', feedbackData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      
      // Reset after showing success
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFeedbackData(prev => ({ ...prev, message: '', rating: 'neutral' }));
      }, 2000);
      
      setIsSubmitting(false);
    }, {
      onError: () => setIsSubmitting(false),
    });
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'positive':
        return <ThumbsUp className="h-5 w-5" />;
      case 'negative':
        return <ThumbsDown className="h-5 w-5" />;
      default:
        return <Meh className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 shadow-lg"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Thank you for your feedback!</h3>
            <p className="text-gray-600">We appreciate your input and will use it to improve EmergencyVet.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Send Feedback</DialogTitle>
              <DialogDescription>
                Help us improve EmergencyVet by sharing your thoughts
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Feedback Type */}
              <div>
                <Label>What type of feedback?</Label>
                <RadioGroup
                  value={feedbackData.type}
                  onValueChange={(value) => setFeedbackData({ ...feedbackData, type: value as any })}
                  className="grid grid-cols-2 gap-3 mt-2"
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="bug" id="bug" />
                    <Label htmlFor="bug" className="cursor-pointer font-normal">Bug Report</Label>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="feature" id="feature" />
                    <Label htmlFor="feature" className="cursor-pointer font-normal">Feature Request</Label>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="improvement" id="improvement" />
                    <Label htmlFor="improvement" className="cursor-pointer font-normal">Improvement</Label>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer font-normal">Other</Label>
                  </label>
                </RadioGroup>
              </div>

              {/* Rating */}
              <div>
                <Label>How's your experience?</Label>
                <div className="flex gap-3 mt-2">
                  <Button
                    type="button"
                    variant={feedbackData.rating === 'positive' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedbackData({ ...feedbackData, rating: 'positive' })}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={feedbackData.rating === 'neutral' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedbackData({ ...feedbackData, rating: 'neutral' })}
                  >
                    <Meh className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={feedbackData.rating === 'negative' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedbackData({ ...feedbackData, rating: 'negative' })}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">Your feedback</Label>
                <Textarea
                  id="message"
                  value={feedbackData.message}
                  onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                  placeholder="Tell us what's on your mind..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {user && (
                <Alert>
                  <AlertDescription className="text-xs">
                    Feedback will be sent as {user.name} ({user.email})
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!feedbackData.message.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Feedback
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Simplified feedback button for quick ratings
export function QuickFeedbackButton() {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleQuickFeedback = async (newRating: 'positive' | 'negative') => {
    setRating(newRating);
    
    // In production, send to analytics
    console.log('Quick feedback:', newRating);
    
    setShowThanks(true);
    setTimeout(() => {
      setShowThanks(false);
      setRating(null);
    }, 2000);
  };

  if (showThanks) {
    return (
      <div className="fixed bottom-6 left-6 bg-white border rounded-lg shadow-lg p-3 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="text-sm">Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 bg-white border rounded-lg shadow-lg p-3">
      <p className="text-sm text-gray-600 mb-2">Was this helpful?</p>
      <div className="flex gap-2">
        <Button
          variant={rating === 'positive' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleQuickFeedback('positive')}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant={rating === 'negative' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleQuickFeedback('negative')}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
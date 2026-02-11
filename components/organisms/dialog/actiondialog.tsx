"use client";

import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectDialogProps {
  title: string;
  description: string;
  orderId: string | number;
  onConfirm: (notes?: string) => void | Promise<void>;
}

export const RejectDialog: React.FC<RejectDialogProps> = ({
  title,
  description,
  orderId,
  onConfirm,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(notes);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-white">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Order ID Display */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Order ID:</span>
          <span className="text-sm text-gray-900 font-semibold">{orderId}</span>
        </div>

        {/* Notes Input */}
        <div className="space-y-2">
          <Label htmlFor="reject-notes" className="text-sm font-medium">
            Reason for Rejection (Optional)
          </Label>
          <Textarea
            id="reject-notes"
            placeholder="Enter the reason for rejecting this order..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            This note will be saved with the order cancellation.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setNotes("");
          }}
          disabled={isSubmitting}
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {isSubmitting ? "Rejecting..." : "Reject Order"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// ApproveDialog remains the same
interface ApproveDialogProps {
  title: string;
  description: string;
  orderId: string | number;
  onConfirm: () => void | Promise<void>;
}

export const ApproveDialog: React.FC<ApproveDialogProps> = ({
  title,
  description,
  orderId,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      {/* <div className="py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Order ID:</span>
          <span className="text-sm text-gray-900 font-semibold">{orderId}</span>
        </div>
      </div> */}

      <DialogFooter>
        <Button
          type="button"
          variant="default"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? "Confirming..." : "Confirm Order"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
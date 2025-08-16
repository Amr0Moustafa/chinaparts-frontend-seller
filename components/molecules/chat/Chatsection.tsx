"use client";

import React, { useRef, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Paperclip,
  Smile,
  SendHorizontal,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "i18next";

type Message = {
  id: string | number;
  sender: "user" | "other";
  content: string;
  time: string;
  status?: string;
};

type ProductInfo = {
  name: string;
  image?: string|null;
  price: number;
  sku: string;
  stock: number;
};

interface ChatSectionProps {
  selectedChat?: {
    id: string | number;
    name: string;
    avatar: string;
    bgColor: string;
  } | null;
  messages?: Message[];
  productInfo?: ProductInfo | null;
  onSendMessage?: (msg: string) => void;
  onMessageChange?: (val: string) => void;
  currentMessage?: string;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  selectedChat,
  messages = [],
  productInfo = null,
  onSendMessage,
  onMessageChange,
  currentMessage = "",
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (currentMessage?.trim() && onSendMessage) {
      onSendMessage(currentMessage.trim());
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChat) {
    return (
     <div className="flex-1 flex items-center justify-center border border-gray-200 bg-white rounded-lg h-full">
  <div className="text-center">
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
     {t("messages.selectConversationTitle") || "Select a conversation"}
    </h3>
    <p className="text-gray-500">
     {t("messages.selectConversationDescription") || "Choose a conversation from the left to start messaging"}
    </p>
  </div>
</div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full ">
      {/* Chat Header */}
      <div className="px-6 py-4 mb-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 ${selectedChat.bgColor} rounded-full flex items-center justify-center text-white text-sm font-medium`}
            >
              {selectedChat.avatar}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedChat.name}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
           <Button
            variant={"outline"}
            className="py-2 px-4 font-semibold text-gray-900 w-auto bg-white border border-gray-300"
          >
            <Check className="w-4 h-4 mr-2" />
           {t("messages.markAllRead")}
          </Button>
            {/* <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" /> */}
          </div>
        </div>
      </div>

      {/* Product Info */}
      {productInfo && (
        <div className="px-6 py-3 bg-orange-50 m-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {productInfo.image ? (
                <img
                  src={productInfo.image}
                  alt={productInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-6 bg-gray-400 rounded"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{productInfo.name}</h3>
              <p className="text-sm text-gray-600">
                {t("messages.price") || "Price"}: ${productInfo.price} • {t("messages.sku") || "SKU"}: {productInfo.sku} • {t("messages.stock") || "Stock"}:{" "}
                {productInfo.stock}
              </p>
            </div>
             <Button
            variant={"outline"}
            className="ms-auto py-2 px-4 font-semibold text-gray-900 w-auto bg-white border border-gray-300"
          >
             {t("messages.viewProduct") || "View Product"}
          </Button>
           
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-orange-50 text-gray-900"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <div className="flex items-center justify-end mt-1">
                <span
                  className={`text-xs ${
                    msg.sender === "user"
                      ? "bg-orange-50"
                      : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </span>
                {msg.status && (
                  <span className="text-xs text-gray-900 ms-2">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3 border border-gray-300 px-3 py-1 rounded-lg">
          <Smile className="w-5 h-5 text-gray-900 cursor-pointer" />
          <Paperclip className="w-5 h-5 text-gray-900 cursor-pointer" />
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) =>
                onMessageChange && onMessageChange(e.target.value)
              }
              placeholder={t("messages.typeMessagePlaceholder") || "Type your message..."}
              className="w-full px-4 py-2 text-gray-900  rounded-lg focus:outline-none focus:ring-0 focus:ring-orange-500"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            
          </div>
          <button
            onClick={handleSendMessage}
            className="p-2 text-orange-500  rounded-lg hover:text-orange-500 transition-colors"
          >
            <SendHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

"use client";

import { StatCard } from "@/components/molecules/widgets/StatCard";
import { MessageSquare, MessageSquareWarning, MessagesSquare, RotateCcw } from "lucide-react";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { IoIosTimer } from "react-icons/io";
import { Conversations } from "../molecules/chat/ConversationPreview";
import { ChatSection } from "../molecules/chat/Chatsection";
import { useState } from "react";

type SenderType = "user" | "other";
type MessageStatus = "delivered" | "seen" | "failed";

type Conversation = {
  id: string | number;
  name: string;
  avatar: string;
  bgColor: string;
  time: string;
  lastMessage: string;
  unread?: boolean;
  type?: "product" | "default";
  resolved?: boolean;
};

interface Message {
  id: number;
  sender: SenderType;
  content: string;
  time: string;
  status?: MessageStatus;
}

type Product = {
  name: string;
  image?: string|null;
  price: number;
  sku: string;
  stock: number;
};

export const MessagesTemplate = () => {
  const { t } = useTranslation();
const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  // Conversations list
  const conversationsData: Conversation[] = [
    {
      id: 1,
      name: "Mike Johnson",
      avatar: "MJ",
      lastMessage: "Hi, do you have brake pads for 2018 Toyota Camry?",
      time: "2 min ago",
      unread: true,
      bgColor: "bg-orange-500",
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar: "SC",
      lastMessage: "Thanks for the quick delivery!",
      time: "1 day ago",
      unread: false,
      bgColor: "bg-gray-400",
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      avatar: "AR",
      lastMessage: "When will my order arrive?",
      time: "5 min ago",
      unread: true,
      bgColor: "bg-blue-500",
    },
  ];

  const statsData = {
    messages: 5,
    productOrders: 3,
    visitedReplies: 12,
  };

  // Messages in selected conversation
  const messagesData: Message[] = selectedChat
    ? [
        {
          id: 1,
          sender: "other",
          content: "Hi, do you have brake pads for 2018 Toyota Camry?",
          time: "10:25 AM",
        },
        {
          id: 2,
          sender: "user",
          content:
            "Yes! We have premium brake pads specifically for your 2018 Toyota Camry. They are OEM quality and come with 1 year warranty.",
          time: "10:26 AM",
          status: "delivered",
        },
        {
          id: 3,
          sender: "other",
          content: "Great! What is the price and delivery time?",
          time: "10:27 AM",
        },
        {
          id: 4,
          sender: "user",
          content:
            "The price is $89.99 and we can deliver within 2-3 business days. Free shipping for orders over $50!",
          time: "10:28 AM",
          status: "delivered",
        },
         {
          id: 5,
          sender: "other",
          content: "Great! What is the price and delivery time?",
          time: "10:27 AM",
        },
        {
          id: 6,
          sender: "user",
          content:
            "The price is $89.99 and we can deliver within 2-3 business days. Free shipping for orders over $50!",
          time: "10:28 AM",
          status: "delivered",
        },
         {
          id: 7,
          sender: "other",
          content: "Great! What is the price and delivery time?",
          time: "10:27 AM",
        },
        {
          id: 4,
          sender: "user",
          content:
            "The price is $89.99 and we can deliver within 2-3 business days. Free shipping for orders over $50!",
          time: "10:28 AM",
          status: "delivered",
        },
      ]
    : [];

  const productData: Product | null = selectedChat
    ? {
        name: "BMW Brake Pad Set",
        price: 89.99,
        sku: "BP-BMW-001",
        stock: 15,
        image: "/images/product/Vector.png",
      }
    : null;

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    
    setCurrentMessage("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
    
  };
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="text-lg  md:text-2xl font-bold">{t("messages.title") || "Messages"}</h3>
        <div className="flex-shrink-0">
          <Button
            variant={"outline"}
            className="py-2 px-4 font-bold text-gray-900 w-auto bg-white border border-gray-300"
          >
            {t("messages.markAllRead") || "Mark All Read"}
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<MessageSquare className="w-7 h-7" />}
            value={12}
            label={t("messages.unreadMessages") || "Unread Messages"}
            color="purple"
            home={false}
          />
          <StatCard
            icon={<RotateCcw className="w-7 h-7" />}
            value={8}
            label={t("messages.returnsOrders") || "Returns Orders"}
            color="orange"
            home={false}
          />
          <StatCard
            icon={<MessageSquareWarning className="w-7 h-7" />}
            value={45}
            label={t("messages.productInquiries") || "Product Inquiries"}
            color="green"
            home={false}
          />
          <StatCard
            icon={<MessagesSquare className="w-7 h-7" />}
            value={65}
            label={t("messages.totalConversations") || "Total Conversations"}
            color="violet"
            home={false}
          />
           <StatCard
            icon={<IoIosTimer className="w-7 h-7" />}
            value={65}
            label={t("messages.avgResponseTime") || "Avg Response Time"}
            color="green"
            home={false}
          />
        </div>
        
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-12  gap-4">
        {/* Left: Conversations */}
        <div className="md:col-span-5 border border-gray-200 bg-white h-full rounded-lg overflow-y-auto h-screen">
          <Conversations 
        selectedChat={selectedChat} 
        onSelectChat={setSelectedChat}
        conversations={conversationsData}
        stats={statsData}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
        </div>

        {/* Right: Message Thread */}
        <div className="md:col-span-7 border border-gray-200 bg-white h-full rounded-lg  h-screen">
          <ChatSection 
        selectedChat={selectedChat}
        messages={messagesData}
        productInfo={productData}
        onSendMessage={handleSendMessage}
        onMessageChange={setCurrentMessage}
        currentMessage={currentMessage}
      />
        </div>
      </div>
      </div>
    </div>
  );
};

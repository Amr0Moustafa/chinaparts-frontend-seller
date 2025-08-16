"use client";

import React, { useState, useMemo } from "react";
import { Search, MessageSquare } from "lucide-react";
import { FilterTabs } from "@/components/organisms/table/TableFilter";
import { useTranslation } from "react-i18next";

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

interface ConversationsProps {
  selectedChat?: Conversation | null;
  onSelectChat?: (chat: Conversation) => void;
  conversations?: Conversation[];
  stats?: {
    messages?: number;
    productOrders?: number;
    visitedReplies?: number;
  };
  tabs?: string[];
  onSearch: (query: string) => void;
  searchQuery: string;
}

const defaultTabs = [
  "messages.tabs.all",
  "messages.tabs.unread",
  "messages.tabs.product",
  "messages.tabs.resolved",
];

export const Conversations: React.FC<ConversationsProps> = ({
  selectedChat,
  onSelectChat,
  conversations = [],
  stats = {},
  tabs = defaultTabs,
}) => {
  const  { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(tabs?.[0] ?? defaultTabs[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultStats = {
    messages: 0,
    productOrders: 0,
    visitedReplies: 0,
    ...stats,
  };

  // Filtered list based on tab + search
 const filteredConversations = useMemo(() => {
    let filtered = conversations;

    if (activeTab === t("messages.tabs.unread")) {
      filtered = filtered.filter((c) => c.unread);
    } else if (activeTab === t("messages.tabs.product")) {
      filtered = filtered.filter((c) => c.type === "product");
    } else if (activeTab === t("messages.tabs.resolved")) {
      filtered = filtered.filter((c) => c.resolved);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [conversations, activeTab, searchQuery, t]);

  return (
    <div className="w-full w-80 md:w-full bg-white  w-full  flex flex-col md:h-full h-screen">
      {/* Header */}
      <div className="p-4  border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <MessageSquare className="w-5 h-5 text-gray-500 " />
          <h2 className="text-lg font-semibold">{t("messages.conversations") || "Conversations"}</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("messages.searchPlaceholder") || "Search conversations..."}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
     <div className="p-1 sm:p-3 xl:p-4 w-full flex justify-center">
  <FilterTabs
    filters={tabs.map((tabKey) => t(tabKey))}
    className="w-full flex flex-wrap justify-center xl:justify-around gap-2 "
    activeFilter={activeTab}
    onChange={(f) => {
      setActiveTab(f);
      setCurrentPage(1);
    }}
  />
</div>


      

      {/* Conversation List */}
      <div className="flex-1 mt-4 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
           {t("messages.noConversations") || "No conversations found."}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectChat && onSelectChat(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-orange-50 ${
                selectedChat?.id === conversation.id
                  ? "bg-orange-50 border-l-4 border-l-orange-500"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 ${conversation.bgColor} rounded-full flex items-center justify-center text-white text-sm font-medium`}
                >
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

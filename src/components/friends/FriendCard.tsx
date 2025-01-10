import { Trash2 } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import React from 'react';
import type { Friend } from '@/api/services/friends-api';

interface FriendCardProps {
  friend: Friend;
  onDelete: (id: number) => void;
}

export function FriendCard({ friend, onDelete }: FriendCardProps) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between rounded-lg bg-white p-4 shadow">
      <View className="flex-row items-center space-x-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Text className="text-lg font-semibold text-blue-500">
            {friend.friend.name ? friend.friend.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>

        <View>
          <Text className="text-base font-medium text-gray-900">
            {friend.friend.name || 'Usuario'}
          </Text>
          <Text className="text-sm text-gray-500">@{friend.friend.username || 'sin_usuario'}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onDelete(friend.id)} className="rounded-full bg-red-100 p-2">
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

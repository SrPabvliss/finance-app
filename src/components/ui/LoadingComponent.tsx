import { ActivityIndicator, View } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

export default function Loading({ size = 'large', color = '#3b82f6' }: LoadingProps) {
  return (
    <View className="flex flex-1 items-center justify-center p-4">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

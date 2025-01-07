import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="w-full">
      {label && <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>}
      <TextInput
        className={`w-full rounded-lg border bg-white px-4 py-3 text-base leading-6 text-gray-700 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}

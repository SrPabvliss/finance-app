import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'flex-row items-center justify-center rounded-lg px-4 py-3';
  const variantStyles = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-200',
  };

  const textStyles = {
    primary: 'text-white',
    secondary: 'text-gray-900',
  };

  return (
    <TouchableOpacity
      className={`
        ${baseStyles} 
        ${variantStyles[variant]}
        ${disabled || isLoading ? 'opacity-50' : 'opacity-100'}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : 'black'} />
      ) : (
        <Text className={`text-center text-base font-semibold ${textStyles[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

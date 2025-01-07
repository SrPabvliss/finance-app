import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const INCOME_CATEGORIES = ['SALARY', 'INVESTMENT', 'BUSINESS', 'FREELANCE', 'GIFT', 'OTHER_INCOME'];

const EXPENSE_CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'UTILITIES',
  'ENTERTAINMENT',
  'HEALTHCARE',
  'EDUCATION',
  'SHOPPING',
  'HOUSING',
  'OTHER_EXPENSE',
];

interface CategorySelectorProps {
  type: 'INCOME' | 'EXPENSE';
  value: string;
  onChange: (category: string) => void;
}

export default function CategorySelector({ type, value, onChange }: CategorySelectorProps) {
  const categories = useMemo(
    () => (type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES),
    [type]
  );

  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-gray-700">Categoría</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => onChange(category)}
            className={`rounded-full px-4 py-2 ${
              value === category
                ? type === 'INCOME'
                  ? 'bg-green-100'
                  : 'bg-red-100'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                value === category
                  ? type === 'INCOME'
                    ? 'text-green-600'
                    : 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {category.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

#!/bin/bash

# 设置环境变量
export AI_TRANSLATOR_API_KEY="your-api-key-here"

# 测试翻译 JSON 文件
echo "Testing JSON file translation..."
npx ai-translator translate -f ./locales/en.json -m chatgpt -s en -t zh ja ko

# 测试递归翻译目录
echo -e "\nTesting recursive directory translation..."
npx ai-translator translate -r -m chatgpt -s en -t zh ja ko

# 测试特定文件模式
echo -e "\nTesting specific file pattern translation..."
npx ai-translator translate -r -m chatgpt -s en -t zh ja ko -p "**/*.{ts,tsx}" 
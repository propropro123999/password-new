"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (options.uppercase) chars += uppercase;
    if (options.lowercase) chars += lowercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    if (!chars) {
      alert("请至少选择一个选项！");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert("密码已复制到剪贴板！");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>密码生成器</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={password}
              readOnly
              placeholder="生成的密码将显示在这里"
            />
            <Button onClick={copyToClipboard}>复制</Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">密码长度: {length}</label>
            <Slider
              value={[length]}
              onValueChange={(value: number[]) => setLength(value[0])}
              min={8}
              max={32}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked: boolean) =>
                  setOptions({ ...options, uppercase: checked })
                }
              />
              <label htmlFor="uppercase">包含大写字母</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked: boolean) =>
                  setOptions({ ...options, lowercase: checked })
                }
              />
              <label htmlFor="lowercase">包含小写字母</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked: boolean) =>
                  setOptions({ ...options, numbers: checked })
                }
              />
              <label htmlFor="numbers">包含数字</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={options.symbols}
                onCheckedChange={(checked: boolean) =>
                  setOptions({ ...options, symbols: checked })
                }
              />
              <label htmlFor="symbols">包含特殊字符</label>
            </div>
          </div>

          <Button className="w-full" onClick={generatePassword}>
            生成密码
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

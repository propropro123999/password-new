"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Shield, Copy, RefreshCw, Key, Lock, Eye, EyeOff } from "lucide-react";

// 定义统计数据的类型
interface PasswordStats {
  totalGenerated: number;
  sessionsGenerated: number;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  // 添加统计数据状态
  const [stats, setStats] = useState<PasswordStats>({
    totalGenerated: 0,
    sessionsGenerated: 0,
  });

  const { toast } = useToast();

  // 在组件挂载时从localStorage加载数据
  useEffect(() => {
    const savedStats = localStorage.getItem("passwordStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // 保存统计数据到localStorage
  const saveStats = (newStats: PasswordStats) => {
    localStorage.setItem("passwordStats", JSON.stringify(newStats));
    setStats(newStats);
  };

  // 评估密码强度
  const evaluatePasswordStrength = (pwd: string): number => {
    if (!pwd) return 0;
    
    let strength = 0;
    
    // 长度检查
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    if (pwd.length >= 16) strength += 1;
    
    // 复杂性检查
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    
    // 最大强度为10
    return Math.min(10, strength);
  };

  const getStrengthLabel = (strength: number): { label: string; color: string } => {
    if (strength <= 3) return { label: "弱", color: "bg-red-500" };
    if (strength <= 6) return { label: "中", color: "bg-yellow-500" };
    return { label: "强", color: "bg-green-500" };
  };

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
      toast({
        title: "错误",
        description: "请至少选择一个字符类型！",
        variant: "destructive",
      });
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    
    // 评估密码强度
    const strength = evaluatePasswordStrength(result);
    setPasswordStrength(strength);

    // 更新统计数据
    const newStats: PasswordStats = {
      totalGenerated: stats.totalGenerated + 1,
      sessionsGenerated: stats.sessionsGenerated + 1
    };
    saveStats(newStats);
    
    toast({
      title: "密码已生成",
      description: "新的安全密码已经生成成功",
    });
  };

  const copyToClipboard = () => {
    if (!password) {
      toast({
        title: "无法复制",
        description: "请先生成一个密码",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(password);
    toast({
      title: "复制成功",
      description: "密码已复制到剪贴板",
    });
  };

  const resetStats = () => {
    const newStats: PasswordStats = {
      ...stats,
      sessionsGenerated: 0
    };
    saveStats(newStats);
    toast({
      title: "统计已重置",
      description: "本次会话统计已重置",
    });
  };

  // 计算进度条百分比值（最大100）
  const calculateProgressValue = (value: number): number => {
    return value > 100 ? 100 : value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 gap-4">
      <div className="w-full max-w-md text-center mb-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          高级密码生成器
        </h1>
        <p className="text-sm text-gray-500">生成安全、强大的密码保护您的账户</p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-t-4 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            密码生成
          </CardTitle>
          <CardDescription>
            配置您的密码选项并生成安全密码
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="flex mb-1">
              <span className="text-sm text-gray-500">密码</span>
              {password && (
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-xs">强度:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${
                      getStrengthLabel(passwordStrength).color === 'bg-red-500' 
                        ? 'border-red-200 bg-red-100 text-red-800' 
                        : getStrengthLabel(passwordStrength).color === 'bg-yellow-500' 
                          ? 'border-yellow-200 bg-yellow-100 text-yellow-800' 
                          : 'border-green-200 bg-green-100 text-green-800'
                    }`}
                  >
                    {getStrengthLabel(passwordStrength).label}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  readOnly
                  placeholder="生成的密码将显示在这里"
                  className="pr-10"
                />
                <button 
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button onClick={copyToClipboard} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {password && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    getStrengthLabel(passwordStrength).color === 'bg-red-500' 
                      ? 'bg-red-500' 
                      : getStrengthLabel(passwordStrength).color === 'bg-yellow-500' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`} 
                  style={{width: `${(passwordStrength / 10) * 100}%`}}
                ></div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">密码长度</label>
              <Badge variant="outline">{length} 字符</Badge>
            </div>
            <Slider
              value={[length]}
              onValueChange={(value: number[]) => setLength(value[0])}
              min={8}
              max={32}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>8</span>
              <span>16</span>
              <span>24</span>
              <span>32</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">字符类型</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked: boolean) =>
                    setOptions({ ...options, uppercase: checked })
                  }
                />
                <label htmlFor="uppercase" className="text-sm">大写字母 (A-Z)</label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked: boolean) =>
                    setOptions({ ...options, lowercase: checked })
                  }
                />
                <label htmlFor="lowercase" className="text-sm">小写字母 (a-z)</label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked: boolean) =>
                    setOptions({ ...options, numbers: checked })
                  }
                />
                <label htmlFor="numbers" className="text-sm">数字 (0-9)</label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked: boolean) =>
                    setOptions({ ...options, symbols: checked })
                  }
                />
                <label htmlFor="symbols" className="text-sm">特殊字符 (!@#$)</label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generatePassword}>
            生成密码
          </Button>
        </CardFooter>
      </Card>

      {/* 数据分析卡片 */}
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            使用统计
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">总共生成次数</span>
              <Badge variant="secondary">{stats.totalGenerated}</Badge>
            </div>
            <Progress value={calculateProgressValue(stats.totalGenerated % 100)} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">本次会话生成次数</span>
              <Badge variant="secondary">{stats.sessionsGenerated}</Badge>
            </div>
            <Progress value={calculateProgressValue(stats.sessionsGenerated % 100)} className="h-2" />
          </div>

          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-xs" 
            onClick={resetStats}
          >
            重置会话统计
          </Button>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-gray-400 mt-6">
        <p>© 2023 密码生成器 | 安全、简单、高效</p>
      </div>
      
      <Toaster />
    </div>
  );
}

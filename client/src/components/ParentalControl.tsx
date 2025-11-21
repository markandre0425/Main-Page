import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FaShieldAlt, FaUserShield, FaClock, FaGamepad, FaBook } from 'react-icons/fa';

interface ParentalControlProps {
  onSettingsChange?: (settings: ParentalSettings) => void;
}

interface ParentalSettings {
  timeLimit: number; // minutes per session
  allowGames: boolean;
  allowLearning: boolean;
  requireSupervision: boolean;
  language: 'en' | 'fil';
}

export default function ParentalControl({ onSettingsChange }: ParentalControlProps) {
  const [settings, setSettings] = useState<ParentalSettings>({
    timeLimit: 30,
    allowGames: true,
    allowLearning: true,
    requireSupervision: true,
    language: 'en'
  });

  const [isParentMode, setIsParentMode] = useState(false);

  const handleSettingChange = (key: keyof ParentalSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  if (!isParentMode) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsParentMode(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
          title="Parent/Teacher Controls"
        >
          <FaShieldAlt className="text-xl" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <FaUserShield className="text-blue-600" />
            Parent/Teacher Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Limit */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-600" />
              <label className="font-medium">Session Time Limit</label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={settings.timeLimit === 15 ? "default" : "outline"}
                onClick={() => handleSettingChange('timeLimit', 15)}
              >
                15 min
              </Button>
              <Button
                size="sm"
                variant={settings.timeLimit === 30 ? "default" : "outline"}
                onClick={() => handleSettingChange('timeLimit', 30)}
              >
                30 min
              </Button>
              <Button
                size="sm"
                variant={settings.timeLimit === 60 ? "default" : "outline"}
                onClick={() => handleSettingChange('timeLimit', 60)}
              >
                60 min
              </Button>
            </div>
          </div>

          {/* Game Access */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaGamepad className="text-gray-600" />
              <span className="font-medium">Allow Games</span>
            </div>
            <Switch
              checked={settings.allowGames}
              onCheckedChange={(checked) => handleSettingChange('allowGames', checked)}
            />
          </div>

          {/* Learning Access */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBook className="text-gray-600" />
              <span className="font-medium">Allow Learning</span>
            </div>
            <Switch
              checked={settings.allowLearning}
              onCheckedChange={(checked) => handleSettingChange('allowLearning', checked)}
            />
          </div>

          {/* Supervision Required */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-gray-600" />
              <span className="font-medium">Require Supervision</span>
            </div>
            <Switch
              checked={settings.requireSupervision}
              onCheckedChange={(checked) => handleSettingChange('requireSupervision', checked)}
            />
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="font-medium">Language</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={settings.language === 'en' ? "default" : "outline"}
                onClick={() => handleSettingChange('language', 'en')}
              >
                English
              </Button>
              <Button
                size="sm"
                variant={settings.language === 'fil' ? "default" : "outline"}
                onClick={() => handleSettingChange('language', 'fil')}
              >
                Filipino
              </Button>
            </div>
          </div>

          {/* Current Settings Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Current Settings:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Time Limit:</span>
                <Badge variant="secondary">{settings.timeLimit} minutes</Badge>
              </div>
              <div className="flex justify-between">
                <span>Games:</span>
                <Badge variant={settings.allowGames ? "default" : "destructive"}>
                  {settings.allowGames ? "Allowed" : "Blocked"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Learning:</span>
                <Badge variant={settings.allowLearning ? "default" : "destructive"}>
                  {settings.allowLearning ? "Allowed" : "Blocked"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => setIsParentMode(false)}
            className="w-full"
            variant="outline"
          >
            Close Controls
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}







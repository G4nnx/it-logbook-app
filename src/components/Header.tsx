
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import Logo from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLogbook } from '@/context/LogbookContext';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

// Notification type definition
interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'logbook' | 'backup';
  read: boolean;
}

const Header = () => {
  const { logEntries, backupLogs } = useLogbook();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Convert log entries to notifications
  useEffect(() => {
    const recentLogEntries = logEntries
      .slice(0, 3)
      .map(entry => ({
        id: `log-${entry.id}`,
        title: `New IT Logbook Entry: ${entry.jenisKerjaan}`,
        description: `${entry.department} - ${entry.status}`,
        timestamp: new Date(entry.tanggalMulai).toLocaleDateString(),
        type: 'logbook' as const,
        read: false
      }));

    const recentBackupLogs = backupLogs
      .slice(0, 3)
      .map(log => ({
        id: `backup-${log.id}`,
        title: `New Backup Log`,
        description: `Shift: ${log.shift} - PIC: ${log.pic}`,
        timestamp: new Date(log.tanggal).toLocaleDateString(),
        type: 'backup' as const,
        read: false
      }));

    // Combine and sort by most recent first
    const combinedNotifications = [...recentLogEntries, ...recentBackupLogs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    // Preserve read status for existing notifications
    setNotifications(prevNotifications => {
      const updatedNotifications = combinedNotifications.map(newNotif => {
        const existingNotif = prevNotifications.find(prev => prev.id === newNotif.id);
        return existingNotif ? { ...newNotif, read: existingNotif.read } : newNotif;
      });
      return updatedNotifications;
    });
  }, [logEntries, backupLogs]);

  // Mark notification as read and navigate
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === notification.id ? { ...notif, read: true } : notif
      )
    );
    setIsNotificationsOpen(false);
    navigate(notification.type === 'backup' ? '/backup-logs' : '/');
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    setIsNotificationsOpen(false);
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>
        
        <div className="flex items-center gap-4">
          <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="bg-blue-50 p-3 border-b border-blue-100 flex justify-between items-center">
                <h3 className="font-medium text-blue-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer ${notification.read ? 'bg-gray-50' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between">
                        <p className={`font-medium text-sm ${notification.read ? 'text-gray-500' : ''}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2">
                              <Badge variant="success" className="text-xs">New</Badge>
                            </span>
                          )}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {notification.type === 'backup' ? 'Backup' : 'IT Log'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">{notification.description}</p>
                      <p className="text-gray-400 text-xs mt-1">{notification.timestamp}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No new notifications</div>
                )}
              </div>
              <div className="p-2 border-t border-gray-100 bg-gray-50">
                <button 
                  className="w-full text-center text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  Close
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/department-settings')}>
                Department Management
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                App Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                User Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="public/lovable-uploads/7f4d106e-d4db-45d3-85a2-0a0bf79054da.png" />
              <AvatarFallback className="bg-blue-100 text-blue-800">AU</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

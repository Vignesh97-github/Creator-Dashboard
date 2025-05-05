import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import Feed from '../components/dashboard/Feed';
import CreditStats from '../components/dashboard/CreditStats';
import Profile from '../components/dashboard/Profile';
import ChartCard from '../components/dashboard/ChartCard';
import NotificationCard from '../components/dashboard/NotificationCard';
import QuickActions from '../components/dashboard/QuickActions';
import { feedService, creditService } from '../services/api';
import Loader from '../components/ui/Loader';

const Dashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalFollowers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [posts, credits] = await Promise.all([
        feedService.getPosts(1),
        creditService.getBalance()
      ]);

      // Calculate statistics
      const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
      const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

      setStats({
        totalPosts: posts.length,
        totalLikes,
        totalComments,
        totalFollowers: user.followers?.length || 0
      });

      // Get recent activity
      const activity = [
        ...posts.map(post => ({
          type: 'post',
          title: 'New Post',
          description: post.content.substring(0, 50) + '...',
          timestamp: post.createdAt
        })),
        ...posts.flatMap(post => 
          post.comments.map(comment => ({
            type: 'comment',
            title: 'New Comment',
            description: comment.content,
            timestamp: comment.createdAt
          }))
        )
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
       .slice(0, 5);

      setRecentActivity(activity);

      // Mock notifications for now
      setNotifications([
        {
          _id: '1',
          type: 'success',
          title: 'Welcome to Creator Dashboard!',
          message: 'Get started by creating your first post.',
          timestamp: new Date(),
          read: false
        },
        {
          _id: '2',
          type: 'info',
          title: 'Credits Added',
          message: 'You received 100 free credits.',
          timestamp: new Date(Date.now() - 86400000),
          read: true
        }
      ]);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={logout} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <WelcomeHeader userName={user.name} />

          {/* Quick Actions */}
          <div className="mt-6">
            <QuickActions />
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Posts"
              value={stats.totalPosts}
              icon={
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              }
            />
            <StatCard
              title="Total Likes"
              value={stats.totalLikes}
              icon={
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />
            <StatCard
              title="Total Comments"
              value={stats.totalComments}
              icon={
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
            <StatCard
              title="Total Followers"
              value={stats.totalFollowers}
              icon={
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Feed />
              <ChartCard
                title="Engagement Overview"
                subtitle="Last 30 days"
              >
                {/* Add chart component here */}
                <div className="h-full flex items-center justify-center text-gray-500">
                  Chart will be implemented here
                </div>
              </ChartCard>
            </div>
            
            <div className="space-y-6">
              <Profile user={user} />
              <CreditStats />
              <NotificationCard notifications={notifications} />
              <ActivityFeed activities={recentActivity} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
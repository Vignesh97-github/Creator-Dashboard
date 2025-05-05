import React from 'react';

const Profile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={user.name}
          className="h-16 w-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
          <p className="mt-1 text-sm text-gray-900">
            {user.isAdmin ? 'Administrator' : 'Creator'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Social Accounts</h3>
          <div className="mt-2 space-y-2">
            {user.socialAccounts?.map((account) => (
              <div
                key={account.platform}
                className="flex items-center space-x-2 text-sm"
              >
                <span className="text-gray-500">{account.platform}:</span>
                <span className="text-gray-900">{account.username}</span>
              </div>
            ))}
            {(!user.socialAccounts || user.socialAccounts.length === 0) && (
              <p className="text-sm text-gray-500">No social accounts connected</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

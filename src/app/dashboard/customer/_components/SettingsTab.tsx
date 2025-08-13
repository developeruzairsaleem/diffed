import { Bell, CreditCard, Shield, User, Wallet } from "lucide-react";

const SettingsTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Settings
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value="customer@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-transparent text-white placeholder:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value="GameMaster_2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-transparent text-white placeholder:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>UTC+1 (Central European Time)</option>
              <option>UTC+0 (Greenwich Mean Time)</option>
              <option>UTC-5 (Eastern Standard Time)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Order Updates</div>
              <div className="text-sm text-gray-500">
                Get notified when order status changes
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">New Messages</div>
              <div className="text-sm text-gray-500">
                Notifications for chat messages
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-gray-300"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Promotions</div>
              <div className="text-sm text-gray-500">
                Special offers and discounts
              </div>
            </div>
            <input type="checkbox" className="rounded border-gray-300" />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Change Password</div>
                <div className="text-sm text-gray-500">
                  Update your account password
                </div>
              </div>
            </div>
            <div className="text-gray-400">→</div>
          </button>

          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  Two-Factor Authentication
                </div>
                <div className="text-sm text-gray-500">
                  Enable 2FA for extra security
                </div>
              </div>
            </div>
            <div className="text-gray-400">→</div>
          </button>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Methods
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  •••• •••• •••• 4242
                </div>
                <div className="text-sm text-gray-500">Expires 12/25</div>
              </div>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700">
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Wallet className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">PayPal</div>
                <div className="text-sm text-gray-500">user@paypal.com</div>
              </div>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700">
              Edit
            </button>
          </div>

          <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600">
            + Add New Payment Method
          </button>
        </div>
      </div>
    </div>
  </div>
);
export default SettingsTab;

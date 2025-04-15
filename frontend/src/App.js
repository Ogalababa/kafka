import React from 'react';
import KafkaStatus from './components/KafkaStatus';
import logo from './assets/exact-logo.svg'; // 你可以先放一个 logo 文件进去
//

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Exact logo" className="h-8" />
          <h1 className="text-2xl font-bold">Exact database synchronisatiesysteem</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li className="font-medium text-blue-600">Home</li>
            {/* 未来可添加更多菜单项 */}
          </ul>
        </nav>
      </header>
      <main className="p-6">
        <KafkaStatus />
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import { news } from '../data/mockData';
import { PencilIcon, TrashIcon } from './Icons';

const NewsTable: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Title</th>
            <th scope="col" className="px-6 py-3">Content</th>
            <th scope="col" className="px-6 py-3">Published At</th>
            <th scope="col" className="px-6 py-3">Image</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item, index) => (
            <tr key={item.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
              <td className="px-6 py-4 max-w-sm truncate">{item.content}</td>
              <td className="px-6 py-4">{item.publishedAt}</td>
              <td className="px-6 py-4">
                <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover rounded-md" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors"><PencilIcon /></button>
                  <button className="text-red-600 hover:text-red-800 transition-colors"><TrashIcon /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsTable;

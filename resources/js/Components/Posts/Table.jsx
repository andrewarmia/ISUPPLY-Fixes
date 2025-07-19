import React from 'react';

export default function PostsTable({posts, isAdmin}) {
    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="py-3 px-6 rounded-tl-lg">
                        ID
                    </th>
                    <th scope="col" className="py-3 px-6 rounded-tl-lg">
                        Image
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Title
                    </th>
                    {isAdmin && (
                        <th scope="col" className="py-3 px-6">
                            Author
                        </th>
                    )}
                    <th scope="col" className="py-3 px-6">
                        Created At
                    </th>
                    <th scope="col" className="py-3 px-6 rounded-tr-lg">
                        Action
                    </th>
                </tr>
                </thead>

                <tbody>
                {posts.map((post) => (
                    <tr key={post.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {post.id}
                        </td>

                        <td className="py-4 px-6">
                            {/*<img src={post.attachment_url} alt={post.attachment_url}
                                 className="w-16 h-16 object-cover rounded"/>*/}
                            <a href={post.attachment_url} target="_blank" rel="noopener noreferrer">
                                {post.attachment_url}
                            </a>
                        </td>
                        <td className="py-4 px-6">
                            {post.title}
                        </td>
                        {isAdmin && (
                            <td className="py-4 px-6">
                                {post.author.name}
                            </td>
                        )}
                        <td className="py-4 px-6">
                            {post.created_at}
                        </td>
                        <td className="py-4 px-6">
                            <a href={route('posts.edit', post.id)}
                               className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

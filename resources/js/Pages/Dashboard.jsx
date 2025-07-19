import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import PostsTable from "@/Components/Posts/Table.jsx";

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const posts = usePage().props.posts || []; // Ensure posts is defined
    const isAdmin = usePage().props.is_admin; // Assuming user_type 1 is admin
    const userTypeString = user.user_type_string || '';
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard"/>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {user.name} ({userTypeString}), welcome to your dashboard!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

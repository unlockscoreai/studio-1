import { isAdmin } from '@/lib/utils'; // Assuming you have a utility to check admin status
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In a real application, you would fetch the user's role from your authentication system
  // and check if they are an admin.
  if (!isAdmin()) {
    redirect('/'); // Redirect non-admin users to the homepage
  }

  return (
    <div>
      <aside>
        {/* Admin navigation goes here */}
        <nav>
          <ul>
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><a href="/admin/users">Users</a></li>
            <li><a href="/admin/invoicing">Invoicing</a></li>
            {/* Add other admin navigation links here */}
          </ul>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
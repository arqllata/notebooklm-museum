export const metadata = {
    title: 'Content Manager',
    robots: 'noindex',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

"use client";

import Head from 'next/head';
import { Layout, Menu, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import "../styles/globals.css";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const menuItems = [
    { key: '1', label: 'Devices' },
    { key: '2', label: 'Mapa' },
    { key: '3', label: 'Exportar dados' },
    { key: '4', label: 'Placeholder 3' },
  ];

  return (
    <html lang="pt-BR">
      <Head>
        <title>Aplicativo de Qualidade do Ar</title>
        <meta name="description" content="Gerado pelo aplicativo de criação" />
      </Head>
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ background: 'var(--header-background)', padding: '0 16px' }}>
            <Title level={3} className="header-title">
              Aplicativo de Qualidade do Ar
            </Title>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: 'var(--sidebar-background)' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                className="sidebar-menu"
                items={menuItems}
                onClick={({ key }) => {
                  if (key === '1') router.push('/');
                  if (key === '3') router.push('/export');
                  // Add more navigation logic here if needed
                }}
              />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              <Content className="content">
                {children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}

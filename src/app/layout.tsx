"use client";

import Head from 'next/head';
import { Layout, Menu, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import "../styles/globals.css";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { key: '/', label: 'Devices' },
    { key: '/map', label: 'Mapa' },
    { key: '/export', label: 'Exportar dados' },
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
                selectedKeys={[pathname]}
                className="sidebar-menu"
                items={menuItems}
                onClick={({ key }) => {
                  router.push(key);
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

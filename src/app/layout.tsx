"use client";

import Head from 'next/head';
import { Layout, Menu, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import "../styles/globals.css";
import { HomeOutlined, EnvironmentOutlined, ExportOutlined, BarChartOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title } = Typography;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname() || '/';

  const menuItems = [
    { key: '/', label: 'Devices', icon: <HomeOutlined /> },
    { key: '/map', label: 'Mapa', icon: <EnvironmentOutlined /> },
    { key: '/export', label: 'Exportar dados', icon: <ExportOutlined /> },
    { key: '/devices-graph', label: 'Gráficos', icon: <BarChartOutlined /> }, // Correctly linked menu item
  ];

  return (
    <html lang="pt-BR">
      <Head>
        <title>Aplicativo de Qualidade do Ar</title>
      </Head>
      <body style={{ margin: 0, padding: 0 }}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            width={200}
            className="bg-zinc-900"
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="p-4">
              <Title level={4} style={{ color: 'white' }}>
                Aplicativo de Qualidade do Ar
              </Title>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              className="sidebar-menu"
              style={{
                background: '#1a1a1a',
                color: 'white',
              }}
              items={menuItems}
              onClick={({ key }) => {
                router.push(key);
              }}
            />
          </Sider>
          <Layout>
            <Content className="content">
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}

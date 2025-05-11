"use client";

import Head from 'next/head';
import { Layout, Menu, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import "../styles/globals.css";
import { HomeOutlined, EnvironmentOutlined, ExportOutlined, BarChartOutlined } from '@ant-design/icons';
import { getTranslation } from '../utils/i18n'; // Update the path to the correct location of the i18n module

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
    { key: '/', label: getTranslation('devices', 'en'), icon: <HomeOutlined /> },
    { key: '/map', label: getTranslation('map', 'en'), icon: <EnvironmentOutlined /> },
    { key: '/export', label: getTranslation('export_data', 'en'), icon: <ExportOutlined /> },
    { key: '/devices-graph', label: getTranslation('graphs', 'en'), icon: <BarChartOutlined /> },
  ];

  return (
    <html lang="en">
      <Head>
        <title>{getTranslation('app_title', 'en')}</title>
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
                {getTranslation('app_title', 'en')}
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
            <Content className="content" style={{ padding: '16px', width: '100%', margin: '0 auto' }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}

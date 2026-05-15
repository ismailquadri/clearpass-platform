import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronDown,
  Zap,
  Play,
  Star,
  Menu,
  X,
  Heart,
  Twitter,
  Linkedin,
  Github,
  Search,
  Sparkles,
  FileText,
  Code,
  Database,
  Layers,
  MessageCircle,
} from 'lucide-react';

// ─── Animation Hook ──────────────────────────────────────────────────────────

function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// ─── Animated Container ──────────────────────────────────────────────────────

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(32px)',
      }}
    >
      {children}
    </div>
  );
}

// ─── ClearPass Full Logo SVG ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _ClearPassLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="140"
      height="30"
      viewBox="0 0 2013 438"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M219.006 438H130.069V349.301H219V262.407L304.046 262.406C328.297 262.405 347.957 242.761 347.957 218.529C347.957 194.297 328.297 174.652 304.046 174.652H219V262.403H131.305C58.7873 262.403 0.000143729 203.663 0 131.202C0 58.7413 58.7872 0 131.305 0H219V86.8938L133.954 86.8953C109.703 86.8957 90.0433 106.539 90.0432 130.772C90.0432 155.004 109.703 174.648 133.954 174.648H219V86.8976H306.695C379.213 86.8976 438 145.638 438 218.099C438 290.56 379.213 349.301 306.695 349.301H219.006V438Z"
        fill="#FF3000"
      />
      <path
        d="M1914.21 185.566C1908.09 185.566 1902.45 184.533 1897.28 182.466C1892.11 180.32 1887.62 177.379 1883.81 173.643C1880.07 169.828 1877.13 165.336 1874.98 160.17C1872.92 155.003 1871.88 149.359 1871.88 143.239C1871.88 137.118 1872.92 131.474 1874.98 126.308C1877.13 121.141 1880.07 116.69 1883.81 112.954C1887.62 109.138 1892.11 106.197 1897.28 104.13C1902.45 101.984 1908.09 100.911 1914.21 100.911C1920.33 100.911 1925.98 101.984 1931.14 104.13C1936.31 106.197 1940.76 109.138 1944.5 112.954C1948.31 116.69 1951.25 121.141 1953.32 126.308C1955.47 131.474 1956.54 137.118 1956.54 143.239C1956.54 149.359 1955.47 155.003 1953.32 160.17C1951.25 165.336 1948.31 169.828 1944.5 173.643C1940.76 177.379 1936.31 180.32 1931.14 182.466C1925.98 184.533 1920.33 185.566 1914.21 185.566ZM1914.21 180.082C1921.29 180.082 1927.57 178.492 1933.05 175.312C1938.54 172.133 1942.83 167.761 1945.93 162.197C1949.11 156.632 1950.7 150.313 1950.7 143.239C1950.7 136.164 1949.11 129.885 1945.93 124.4C1942.83 118.836 1938.54 114.464 1933.05 111.284C1927.57 108.105 1921.29 106.515 1914.21 106.515C1907.14 106.515 1900.82 108.105 1895.25 111.284C1889.77 114.464 1885.44 118.836 1882.26 124.4C1879.16 129.885 1877.61 136.164 1877.61 143.239C1877.61 150.313 1879.16 156.632 1882.26 162.197C1885.44 167.761 1889.77 172.133 1895.25 175.312C1900.82 178.492 1907.14 180.082 1914.21 180.082ZM1897.52 167.801V118.677H1919.1C1924.11 118.677 1927.84 119.988 1930.31 122.611C1932.85 125.235 1934.12 128.851 1934.12 133.462C1934.12 136.721 1933.37 139.582 1931.86 142.046C1930.43 144.51 1928.32 146.299 1925.54 147.412L1935.91 167.801H1928.16L1918.62 148.723H1904.67V167.801H1897.52ZM1904.67 142.523H1918.86C1921.25 142.523 1923.15 141.728 1924.59 140.139C1926.1 138.549 1926.85 136.323 1926.85 133.462C1926.85 130.68 1926.14 128.573 1924.7 127.142C1923.35 125.632 1921.41 124.877 1918.86 124.877H1904.67V142.523Z"
        fill="#FF3000"
      />
      <path
        d="M1782.9 308.269C1771.46 308.269 1761.39 307.104 1752.7 304.772C1744.01 302.441 1736.81 299.05 1731.08 294.6C1725.36 290.149 1721.02 284.851 1718.05 278.705C1715.08 272.559 1713.6 265.565 1713.6 257.724C1713.6 256.664 1713.6 255.71 1713.6 254.863C1713.6 253.803 1713.71 252.955 1713.92 252.319H1741.57C1741.36 253.167 1741.26 253.909 1741.26 254.545C1741.26 255.18 1741.26 255.816 1741.26 256.452C1741.47 263.87 1743.38 269.698 1746.98 273.936C1750.79 278.175 1755.99 281.142 1762.56 282.837C1769.13 284.533 1776.44 285.381 1784.49 285.381C1791.48 285.381 1797.95 284.533 1803.88 282.837C1809.82 280.93 1814.48 278.175 1817.87 274.572C1821.47 270.757 1823.27 265.989 1823.27 260.267C1823.27 253.273 1820.94 247.975 1816.28 244.372C1811.83 240.557 1805.9 237.59 1798.48 235.471C1791.06 233.352 1783.32 231.126 1775.27 228.795C1768.49 226.888 1761.71 224.768 1754.93 222.437C1748.14 220.106 1742 217.245 1736.49 213.854C1731.19 210.463 1726.85 206.119 1723.45 200.82C1720.28 195.31 1718.69 188.422 1718.69 180.157C1718.69 172.739 1720.17 166.17 1723.14 160.447C1726.32 154.725 1730.77 149.851 1736.49 145.824C1742.21 141.798 1749.1 138.83 1757.15 136.923C1765.42 134.804 1774.53 133.744 1784.49 133.744C1795.09 133.744 1804.31 134.91 1812.15 137.241C1820.2 139.572 1826.88 142.857 1832.17 147.096C1837.47 151.334 1841.39 156.209 1843.94 161.719C1846.48 167.017 1847.75 172.739 1847.75 178.885C1847.75 180.157 1847.75 181.429 1847.75 182.7C1847.75 183.76 1847.65 184.608 1847.43 185.243H1820.09V181.746C1820.09 177.508 1818.93 173.481 1816.6 169.666C1814.48 165.64 1810.66 162.461 1805.15 160.13C1799.86 157.586 1792.44 156.315 1782.9 156.315C1776.76 156.315 1771.46 156.845 1767.01 157.904C1762.56 158.752 1758.85 160.235 1755.88 162.355C1752.91 164.262 1750.69 166.593 1749.2 169.349C1747.72 171.892 1746.98 174.859 1746.98 178.25C1746.98 183.76 1748.78 187.998 1752.38 190.965C1755.99 193.932 1760.75 196.37 1766.69 198.277C1772.83 200.184 1779.4 202.304 1786.4 204.635C1793.82 206.754 1801.34 208.98 1808.97 211.311C1816.81 213.43 1823.91 216.185 1830.27 219.576C1836.84 222.967 1842.03 227.629 1845.84 233.564C1849.87 239.286 1851.88 246.915 1851.88 256.452C1851.88 265.353 1850.19 273.089 1846.8 279.658C1843.41 286.228 1838.53 291.633 1832.17 295.871C1826.03 300.11 1818.72 303.183 1810.24 305.09C1801.97 307.209 1792.86 308.269 1782.9 308.269Z"
        fill="#FF3000"
      />
      <path
        d="M1630.39 308.269C1618.94 308.269 1608.87 307.104 1600.19 304.772C1591.5 302.441 1584.29 299.05 1578.57 294.6C1572.85 290.149 1568.5 284.851 1565.53 278.705C1562.57 272.559 1561.08 265.565 1561.08 257.724C1561.08 256.664 1561.08 255.71 1561.08 254.863C1561.08 253.803 1561.19 252.955 1561.4 252.319H1589.06C1588.85 253.167 1588.74 253.909 1588.74 254.545C1588.74 255.18 1588.74 255.816 1588.74 256.452C1588.95 263.87 1590.86 269.698 1594.46 273.936C1598.28 278.175 1603.47 281.142 1610.04 282.837C1616.61 284.533 1623.92 285.381 1631.97 285.381C1638.97 285.381 1645.43 284.533 1651.37 282.837C1657.3 280.93 1661.96 278.175 1665.35 274.572C1668.96 270.757 1670.76 265.989 1670.76 260.267C1670.76 253.273 1668.43 247.975 1663.76 244.372C1659.31 240.557 1653.38 237.59 1645.96 235.471C1638.54 233.352 1630.81 231.126 1622.76 228.795C1615.97 226.888 1609.19 224.768 1602.41 222.437C1595.63 220.106 1589.48 217.245 1583.97 213.854C1578.67 210.463 1574.33 206.119 1570.94 200.82C1567.76 195.31 1566.17 188.422 1566.17 180.157C1566.17 172.739 1567.65 166.17 1570.62 160.447C1573.8 154.725 1578.25 149.851 1583.97 145.824C1589.69 141.798 1596.58 138.83 1604.64 136.923C1612.9 134.804 1622.01 133.744 1631.97 133.744C1642.57 133.744 1651.79 134.91 1659.63 137.241C1667.69 139.572 1674.36 142.857 1679.66 147.096C1684.96 151.334 1688.88 156.209 1691.42 161.719C1693.96 167.017 1695.24 172.739 1695.24 178.885C1695.24 180.157 1695.24 181.429 1695.24 182.7C1695.24 183.76 1695.13 184.608 1694.92 185.243H1667.58V181.746C1667.58 177.508 1666.41 173.481 1664.08 169.666C1661.96 165.64 1658.15 162.461 1652.64 160.13C1647.34 157.586 1639.92 156.315 1630.39 156.315C1624.24 156.315 1618.94 156.845 1614.49 157.904C1610.04 158.752 1606.33 160.235 1603.36 162.355C1600.4 164.262 1598.17 166.593 1596.69 169.349C1595.2 171.892 1594.46 174.859 1594.46 178.25C1594.46 183.76 1596.26 187.998 1599.87 190.965C1603.47 193.932 1608.24 196.37 1614.17 198.277C1620.32 200.184 1626.89 202.304 1633.88 204.635C1641.3 206.754 1648.82 208.98 1656.45 211.311C1664.29 213.43 1671.39 216.185 1677.75 219.576C1684.32 222.967 1689.51 227.629 1693.33 233.564C1697.36 239.286 1699.37 246.915 1699.37 256.452C1699.37 265.353 1697.67 273.089 1694.28 279.658C1690.89 286.228 1686.02 291.633 1679.66 295.871C1673.51 300.11 1666.2 303.183 1657.72 305.09C1649.46 307.209 1640.35 308.269 1630.39 308.269Z"
        fill="#FF3000"
      />
      <path
        d="M1450.16 308.27C1444.02 308.27 1437.87 307.528 1431.72 306.044C1425.58 304.561 1419.86 302.124 1414.56 298.733C1409.26 295.342 1405.02 290.679 1401.84 284.745C1398.66 278.599 1397.07 270.97 1397.07 261.857C1397.07 250.413 1399.83 240.982 1405.34 233.564C1410.85 226.146 1418.48 220.424 1428.23 216.398C1438.19 212.159 1449.95 209.298 1463.51 207.814C1477.08 206.119 1491.81 205.271 1507.7 205.271V186.198C1507.7 180.052 1506.64 174.753 1504.52 170.303C1502.4 165.852 1498.59 162.461 1493.08 160.13C1487.78 157.587 1480.15 156.315 1470.19 156.315C1460.65 156.315 1453.02 157.587 1447.3 160.13C1441.79 162.461 1437.87 165.534 1435.54 169.349C1433.42 173.164 1432.36 177.402 1432.36 182.065V186.833H1405.34C1405.13 185.774 1405.02 184.714 1405.02 183.654C1405.02 182.595 1405.02 181.323 1405.02 179.84C1405.02 169.667 1407.78 161.19 1413.29 154.408C1419.01 147.414 1426.96 142.222 1437.13 138.831C1447.3 135.228 1458.96 133.427 1472.1 133.427C1486.09 133.427 1497.74 135.44 1507.07 139.467C1516.6 143.493 1523.7 149.216 1528.37 156.633C1533.24 164.051 1535.68 172.952 1535.68 183.336V273.937C1535.68 277.964 1536.63 280.825 1538.54 282.52C1540.45 284.004 1542.78 284.745 1545.53 284.745H1557.93V303.183C1554.96 304.455 1551.68 305.515 1548.07 306.362C1544.47 307.422 1540.34 307.952 1535.68 307.952C1530.17 307.952 1525.61 306.786 1522.01 304.455C1518.4 302.336 1515.65 299.369 1513.74 295.554C1511.83 291.527 1510.56 287.077 1509.93 282.202H1507.7C1503.89 287.5 1499.01 292.163 1493.08 296.19C1487.36 300.004 1480.89 302.971 1473.69 305.091C1466.48 307.21 1458.64 308.27 1450.16 308.27ZM1457.16 284.745C1463.94 284.745 1470.3 283.686 1476.23 281.566C1482.38 279.447 1487.78 276.48 1492.44 272.665C1497.11 268.639 1500.81 263.87 1503.57 258.36C1506.32 252.85 1507.7 246.81 1507.7 240.24V226.252C1490.54 226.252 1475.91 227.206 1463.83 229.113C1451.75 231.021 1442.43 234.412 1435.86 239.286C1429.5 244.161 1426.32 251.048 1426.32 259.949C1426.32 265.672 1427.59 270.334 1430.14 273.937C1432.68 277.54 1436.28 280.295 1440.94 282.202C1445.61 283.898 1451.01 284.745 1457.16 284.745Z"
        fill="#FF3000"
      />
      <path
        d="M1237.37 359.451V137.242H1259.62L1262.48 161.084H1264.71C1270.43 151.759 1277.74 144.871 1286.64 140.42C1295.54 135.758 1305.61 133.427 1316.84 133.427C1330.83 133.427 1342.7 136.5 1352.45 142.646C1362.2 148.792 1369.72 158.435 1375.02 171.574C1380.32 184.502 1382.97 201.351 1382.97 222.12C1382.97 241.617 1380.21 257.83 1374.7 270.758C1369.4 283.474 1361.88 292.905 1352.13 299.051C1342.38 305.197 1331.04 308.27 1318.11 308.27C1310.91 308.27 1304.13 307.422 1297.77 305.726C1291.41 304.031 1285.69 301.382 1280.6 297.779C1275.52 293.964 1271.07 289.196 1267.25 283.474H1265.34V359.451H1237.37ZM1309.21 283.792C1319.6 283.792 1328.08 281.778 1334.65 277.752C1341.22 273.513 1346.09 267.049 1349.27 258.36C1352.45 249.459 1354.04 238.121 1354.04 224.345V217.669C1354.04 203.046 1352.34 191.39 1348.95 182.701C1345.56 173.8 1340.58 167.442 1334.01 163.627C1327.65 159.812 1319.7 157.905 1310.17 157.905C1299.78 157.905 1291.2 160.236 1284.42 164.898C1277.85 169.349 1272.97 176.131 1269.79 185.244C1266.83 194.357 1265.34 205.483 1265.34 218.623V223.391C1265.34 235.048 1266.4 244.796 1268.52 252.638C1270.85 260.267 1274.03 266.413 1278.06 271.076C1282.3 275.738 1287.07 279.023 1292.37 280.931C1297.66 282.838 1303.28 283.792 1309.21 283.792Z"
        fill="#FF3000"
      />
      <path
        d="M1141.35 304.455V137.242H1163.93L1166.47 164.898H1168.69C1170.39 159.6 1172.72 154.62 1175.69 149.957C1178.65 145.083 1182.68 141.162 1187.77 138.195C1192.85 135.016 1199.11 133.427 1206.52 133.427C1209.7 133.427 1212.56 133.745 1215.11 134.38C1217.86 134.804 1219.87 135.334 1221.15 135.97V161.72H1210.66C1203.45 161.72 1197.2 162.991 1191.9 165.534C1186.81 167.866 1182.58 171.256 1179.18 175.707C1175.79 180.157 1173.25 185.456 1171.55 191.602C1170.07 197.748 1169.33 204.318 1169.33 211.311V304.455H1141.35Z"
        fill="#FF3000"
      />
      <path
        d="M1019.62 308.27C1013.48 308.27 1007.33 307.528 1001.19 306.044C995.041 304.561 989.319 302.124 984.02 298.733C978.722 295.342 974.484 290.679 971.305 284.745C968.126 278.599 966.536 270.97 966.536 261.857C966.536 250.413 969.291 240.982 974.801 233.564C980.312 226.146 987.941 220.424 997.69 216.398C1007.65 212.159 1019.41 209.298 1032.98 207.814C1046.54 206.119 1061.27 205.271 1077.16 205.271V186.198C1077.16 180.052 1076.1 174.753 1073.99 170.303C1071.87 165.852 1068.05 162.461 1062.54 160.13C1057.24 157.587 1049.61 156.315 1039.65 156.315C1030.12 156.315 1022.49 157.587 1016.76 160.13C1011.25 162.461 1007.33 165.534 1005 169.349C1002.88 173.164 1001.82 177.402 1001.82 182.065V186.833H974.801C974.589 185.774 974.484 184.714 974.484 183.654C974.484 182.595 974.484 181.323 974.484 179.84C974.484 169.667 977.239 161.19 982.749 154.408C988.471 147.414 996.418 142.222 1006.59 138.831C1016.76 135.228 1028.42 133.427 1041.56 133.427C1055.55 133.427 1067.2 135.44 1076.53 139.467C1086.07 143.493 1093.16 149.216 1097.83 156.633C1102.7 164.051 1105.14 172.952 1105.14 183.336V273.937C1105.14 277.964 1106.09 280.825 1108 282.52C1109.91 284.004 1112.24 284.745 1114.99 284.745H1127.39V303.183C1124.42 304.455 1121.14 305.515 1117.54 306.362C1113.93 307.422 1109.8 307.952 1105.14 307.952C1099.63 307.952 1095.07 306.786 1091.47 304.455C1087.87 302.336 1085.11 299.369 1083.2 295.554C1081.3 291.527 1080.03 287.077 1079.39 282.202H1077.16C1073.35 287.5 1068.47 292.163 1062.54 296.19C1056.82 300.004 1050.35 302.971 1043.15 305.091C1035.94 307.21 1028.1 308.27 1019.62 308.27ZM1026.62 284.745C1033.4 284.745 1039.76 283.686 1045.69 281.566C1051.84 279.447 1057.24 276.48 1061.9 272.665C1066.57 268.639 1070.28 263.87 1073.03 258.36C1075.79 252.85 1077.16 246.81 1077.16 240.24V226.252C1060 226.252 1045.37 227.206 1033.29 229.113C1021.21 231.021 1011.89 234.412 1005.32 239.286C998.962 244.161 995.783 251.048 995.783 259.949C995.783 265.672 997.054 270.334 999.597 273.937C1002.14 277.54 1005.74 280.295 1010.41 282.202C1015.07 283.898 1020.47 284.745 1026.62 284.745Z"
        fill="#FF3000"
      />
      <path
        d="M879.798 308.27C863.267 308.27 849.28 305.197 837.836 299.051C826.603 292.693 818.02 283.05 812.086 270.122C806.364 257.194 803.503 240.77 803.503 220.848C803.503 200.715 806.364 184.29 812.086 171.574C818.02 158.647 826.709 149.11 838.154 142.964C849.598 136.606 863.903 133.427 881.07 133.427C896.752 133.427 909.892 136.5 920.489 142.646C931.085 148.58 939.033 157.587 944.331 169.667C949.841 181.535 952.596 196.476 952.596 214.49V227.842H832.431C832.855 241.194 834.763 252.214 838.154 260.903C841.756 269.38 847.055 275.632 854.048 279.659C861.042 283.474 869.837 285.381 880.434 285.381C887.639 285.381 893.891 284.533 899.19 282.838C904.7 280.931 909.256 278.281 912.859 274.891C916.674 271.5 919.535 267.473 921.442 262.81C923.35 258.148 924.409 253.062 924.621 247.551H951.96C951.749 256.453 950.053 264.718 946.874 272.347C943.695 279.765 939.033 286.123 932.887 291.421C926.741 296.719 919.217 300.852 910.316 303.819C901.415 306.786 891.242 308.27 879.798 308.27ZM833.067 206.861H923.668C923.668 197.536 922.608 189.694 920.489 183.336C918.369 176.979 915.296 171.786 911.27 167.76C907.455 163.733 902.898 160.872 897.6 159.176C892.514 157.269 886.686 156.315 880.116 156.315C870.367 156.315 862.102 158.117 855.32 161.72C848.538 165.322 843.346 170.833 839.743 178.25C836.14 185.668 833.915 195.205 833.067 206.861Z"
        fill="#FF3000"
      />
      <path d="M751.174 304.455V74.6162H779.149V304.455H751.174Z" fill="#FF3000" />
      <path
        d="M627.977 308.27C605.724 308.27 586.862 304.243 571.391 296.19C555.921 287.924 544.052 275.526 535.787 258.996C527.734 242.253 523.707 221.06 523.707 195.417C523.707 157.481 532.926 129.188 551.364 110.538C569.802 91.8884 595.446 82.5635 628.295 82.5635C646.945 82.5635 663.475 85.6365 677.887 91.7825C692.298 97.7165 703.53 106.83 711.584 119.122C719.849 131.202 723.982 146.461 723.982 164.899H693.464C693.464 152.183 690.708 141.692 685.198 133.427C679.9 125.162 672.376 119.016 662.628 114.989C652.879 110.75 641.435 108.631 628.295 108.631C613.036 108.631 599.896 111.598 588.876 117.532C577.855 123.466 569.484 132.685 563.762 145.189C558.04 157.481 555.179 173.376 555.179 192.873V199.549C555.179 218.835 558.04 234.624 563.762 246.916C569.484 258.996 577.749 267.897 588.558 273.619C599.578 279.341 612.824 282.202 628.295 282.202C641.858 282.202 653.515 280.189 663.263 276.162C673.224 272.136 680.854 265.99 686.152 257.724C691.662 249.247 694.417 238.65 694.417 225.935H723.982C723.982 244.796 719.743 260.267 711.266 272.347C703 284.428 691.662 293.435 677.251 299.369C662.84 305.303 646.415 308.27 627.977 308.27Z"
        fill="#FF3000"
      />
    </svg>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ onGetStarted }: { onGetStarted?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Docs', href: '#docs' },
    { label: 'Guides', href: '#guides' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF3000]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">ClearPass</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="hidden text-sm font-medium text-gray-600 hover:text-black transition-colors sm:block">
              Sign in
            </button>
            <button
              onClick={onGetStarted}
              className="rounded-xl bg-[#FF3000] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e02a00] transition-colors"
            >
              Get started free
            </button>
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 right-0 bg-white border-b border-gray-200 transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((item) => (
            <a key={item.label} href={item.href} className="text-gray-600 hover:text-black py-2">
              {item.label}
            </a>
          ))}
          <button className="mt-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-600">
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section (Firecrawl-style) ──────────────────────────────────────────

function HeroSection({ onGetStarted }: { onGetStarted?: () => void }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6 pt-24 pb-16">
      {/* Background gradients - Firecrawl style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-b from-[#FF3000]/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-32 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          className={`mb-8 inline-flex items-center gap-2 rounded-full border border-[#FF3000]/20 bg-[#FF3000]/5 px-4 py-2 text-sm text-[#FF3000] font-medium transition-all duration-700 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Built for Nigerian government contractors
        </div>

        {/* Headline - large, bold */}
        <h1
          className={`text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight text-black mb-6 leading-[1] transition-all duration-700 delay-100 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Stop losing contracts
          <br />
          <span className="text-[#FF3000]">to expired certificates.</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`mx-auto mb-12 max-w-2xl text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-200 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Nigerian businesses lose billions in government contracts every year because one
          certificate lapsed without warning. ClearPass tracks every certificate, scores your
          readiness, and alerts you before it's too late.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col items-center gap-4 sm:flex-row sm:justify-center transition-all duration-700 delay-300 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={onGetStarted}
            className="group flex items-center gap-3 rounded-2xl bg-[#FF3000] px-10 py-5 text-lg font-bold text-white hover:bg-[#e02a00] transition-all shadow-xl shadow-[#FF3000]/20"
          >
            Check your compliance now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-5 text-lg font-medium text-gray-700 hover:border-gray-300 hover:shadow-lg transition-all">
            <Play className="h-5 w-5" />
            Watch demo
          </button>
        </div>

        {/* Trust indicators */}
        <p
          className={`mt-6 text-sm text-gray-500 transition-all duration-700 delay-400 ${
            animated ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Free to start · No credit card required · Takes 3 minutes
        </p>

        {/* Dashboard preview - Firecrawl-style browser frame */}
        <div
          className={`mx-auto mt-20 max-w-4xl transition-all duration-1000 delay-500 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden group">
            {/* Browser window controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-1.5 text-xs text-gray-500">
                  clearpass.ng/dashboard
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Compliance Dashboard
                  </div>
                  <div className="text-lg font-bold text-black flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                    Zenith Construction Ltd.
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Status</div>
                    <div className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Bid-ready
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { name: 'NHIA', status: 'active', days: 180 },
                  { name: 'PCC', status: 'active', days: 92 },
                  { name: 'NSITF', status: 'warning', days: 14 },
                  { name: 'TCC', status: 'active', days: 245 },
                  { name: 'BPP', status: 'active', days: 310 },
                  { name: 'ITF', status: 'expired' },
                ].map((cert) => (
                  <div
                    key={cert.name}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                      cert.status === 'active'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : cert.status === 'warning'
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {cert.status === 'active' ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : cert.status === 'warning' ? (
                      <Clock className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                    <span>{cert.name}</span>
                    {cert.days && <span className="opacity-70">{cert.days}d</span>}
                  </div>
                ))}
              </div>

              {/* Alert banner */}
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <div className="text-sm flex-1">
                  <span className="font-semibold text-amber-700">Action needed:</span>
                  <span className="text-gray-600">
                    {' '}
                    NSITF expires in 14 days. Renew now to stay bid-eligible.
                  </span>
                </div>
                <button className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200 transition-colors">
                  Renew
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </div>
    </section>
  );
}

// ─── Logos Section ──────────────────────────────────────────────────────────

function LogosSection() {
  return (
    <section className="bg-white py-16 px-6 border-y border-gray-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-sm font-medium text-gray-500 mb-8">
          Trusted by leading Nigerian contractors
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
          {[
            'Zenith Construction',
            'BuildTech Nigeria',
            'Metro Engineering',
            'Prime Contractors',
            'Nigerian Infra',
          ].map((company) => (
            <div key={company} className="text-xl font-bold text-gray-400">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid (Firecrawl-style) ──────────────────────────────────────

function FeaturesGrid() {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Scrape any website',
      description:
        'Extract structured data from any URL with our advanced web scraper. Handles JavaScript, SPA, and dynamic content.',
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: 'Crawl entire sites',
      description:
        'Map entire websites with configurable depth, filters, and rate limiting. Perfect for comprehensive data collection.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Markdown output',
      description:
        'Get clean, readable markdown from any webpage. Preserve structure, links, and formatting automatically.',
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Developer-first API',
      description:
        'RESTful API with comprehensive documentation, SDKs for popular languages, and webhook support.',
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Structured data',
      description:
        'Extract JSON, CSV, or HTML with custom schemas. Perfect for AI training data and data pipelines.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Lightning fast',
      description:
        'Async processing with global CDN edge deployment. Get results in seconds, not minutes.',
    },
  ];

  return (
    <section className="bg-gray-50 py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection>
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FF3000]/10 px-4 py-2 text-sm font-medium text-[#FF3000] mb-4">
                <Sparkles className="h-4 w-4" />
                Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black">
                Everything you need to
                <br />
                <span className="text-[#FF3000]">scrape the web.</span>
              </h2>
            </div>
            <p className="mt-4 md:mt-0 md:text-right text-gray-600 max-w-md">
              From simple URL scraping to complex multi-page crawls, Firecrawl handles it all.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 100}>
              <div className="group rounded-2xl border border-gray-200 bg-white p-8 hover:border-[#FF3000]/30 hover:shadow-xl transition-all duration-300">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF3000]/10 text-[#FF3000]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#FF3000] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works (Firecrawl-style with numbered steps) ────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Enter a URL',
      description:
        'Start with any URL. Firecrawl will crawl and extract the content, converting it to clean markdown.',
      code: 'curl -X POST https://api.firecrawl.dev/v0/scrape \\ -d \'{"url":"https://example.com"}\'',
    },
    {
      number: '02',
      title: 'We handle the rest',
      description:
        'Our infrastructure renders JavaScript, handles rate limits, and extracts structured data automatically.',
      code: '{"data":{"title":"Example","description":"..."}}',
    },
    {
      number: '03',
      title: 'Get structured data',
      description:
        'Receive clean markdown, HTML, or custom structured data ready for AI models or your application.',
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection>
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF3000]/10 px-4 py-2 text-sm font-medium text-[#FF3000] mb-4">
              <Sparkles className="h-4 w-4" />
              How it works
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black">
              Three steps to web data.
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 150}>
              <div className="relative">
                {/* Step number */}
                <div className="mb-6 text-6xl font-black text-[#FF3000]/10">{step.number}</div>

                <h3 className="text-xl font-bold text-black mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>

                {step.code && (
                  <div className="rounded-xl bg-gray-900 p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                    {step.code}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Code Example (Firecrawl-style) ─────────────────────────────────────────

function CodeExample() {
  return (
    <section className="bg-gray-900 py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <AnimatedSection>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FF3000]/20 px-4 py-2 text-sm font-medium text-[#FF3000] mb-4">
                <Code className="h-4 w-4" />
                Developer API
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                Built for developers.
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Simple REST API with comprehensive documentation, client libraries, and examples in
                every language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-100 transition-colors">
                  View documentation
                </button>
                <button className="rounded-xl border border-gray-700 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors">
                  Get API key free
                </button>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden">
              {/* Window controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-xs text-gray-500">example.ts</div>
              </div>

              {/* Code */}
              <div className="p-6 text-sm font-mono">
                <div className="text-gray-500">{'// Scrape a website'}</div>
                <div className="text-[#FF3000]">import</div>
                <div className="text-white"> {'{ Firecrawl }'} </div>
                <div className="text-gray-500">from</div>
                <div className="text-green-400">'firecrawl-py'</div>
                <br />
                <div className="text-[#FF3000]">const</div>
                <div className="text-white">firecrawl = </div>
                <div className="text-[#FF3000]">new</div>
                <div className="text-white"> Firecrawl</div>
                <span className="text-gray-500">()</span>
                <br />
                <div className="text-[#FF3000]">const</div>
                <div className="text-white"> response = </div>
                <div className="text-[#FF3000]">await</div>
                <div className="text-white"> firecrawl</div>
                <span className="text-gray-500">.</span>
                <div className="text-white">scrape</div>
                <span className="text-gray-500">(</span>
                <br />
                <div className="text-white pl-6">'https://example.com'</div>
                <span className="text-gray-500">, {'{'}</span>
                <br />
                <div className="text-white pl-12">formats: </div>
                <span className="text-gray-500">['markdown']</span>
                <br />
                <span className="text-gray-500 pl-6">{'}'}</span>
                <span className="text-gray-500">)</span>
                <br />
                <br />
                <div className="text-gray-500">console.log(response.markdown)</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────

function Testimonials() {
  const testimonials = [
    {
      name: 'Emeka Nwankwo',
      role: 'CEO, Zenith Construction',
      quote:
        'We almost lost a ₦2B contract because our NSITF certificate had expired. ClearPass would have prevented that.',
      avatar: 'EN',
    },
    {
      name: 'Adaeze Okonkwo',
      role: 'Procurement Director',
      quote:
        'We verify contractor compliance in seconds now. What used to take days is now instant and reliable.',
      avatar: 'AO',
    },
    {
      name: 'Olumide Adeyemi',
      role: 'Partner, Procurement Partners',
      quote:
        'Managing compliance for 40+ clients used to be chaos. Now I have a real-time dashboard showing exactly who needs what.',
      avatar: 'OA',
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection>
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF3000]/10 px-4 py-2 text-sm font-medium text-[#FF3000] mb-4">
              <MessageCircle className="h-4 w-4" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black">
              Loved by businesses across Nigeria
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 150}>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#FF3000] text-[#FF3000]" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF3000] to-[#ff8c00] flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-black">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '₦0',
      period: 'Free forever',
      description: 'For individual contractors just getting started.',
      features: [
        'Track up to 3 certificates',
        'Basic compliance score',
        'Email alerts only',
        '1 user account',
      ],
      featured: false,
    },
    {
      name: 'Pro',
      price: '₦24,999',
      period: 'per month',
      description: 'For growing businesses managing multiple contracts.',
      features: [
        'Track all 6 certificates',
        'Full compliance scoring',
        'SMS + Email + Push alerts',
        'Shareable verification links',
        'BVN verification',
        '5 team members',
      ],
      featured: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      description: 'For MDAs and large organizations.',
      features: [
        'Everything in Pro',
        'Bulk verification API',
        'White-labeled reports',
        'Dedicated account manager',
        'Custom integrations',
        'Unlimited team members',
      ],
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="bg-gray-50 py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection>
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF3000]/10 px-4 py-2 text-sm font-medium text-[#FF3000] mb-4">
              <Sparkles className="h-4 w-4" />
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black mb-4">
              Simple pricing. No surprises.
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-600">
              Start free. Upgrade when you need more. Cancel anytime.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 150}>
              <div
                className={`relative rounded-2xl border p-8 transition-all ${
                  plan.featured
                    ? 'border-[#FF3000] bg-white shadow-2xl shadow-[#FF3000]/10'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#FF3000] px-4 py-1.5 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#FF3000]">
                  {plan.name}
                </div>
                <div className="mb-2">
                  <span className="text-4xl font-black text-black">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-[#FF3000] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full rounded-xl px-6 py-4 font-semibold transition-all ${
                    plan.featured
                      ? 'bg-[#FF3000] text-white hover:bg-[#e02a00] shadow-lg shadow-[#FF3000]/20'
                      : 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {plan.name === 'Starter'
                    ? 'Get started free'
                    : plan.name === 'Pro'
                      ? 'Start free trial'
                      : 'Contact sales'}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#FF3000] py-24 px-6">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <h2 className="mb-6 text-4xl md:text-5xl font-black tracking-tight text-white">
            Start scraping today.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-xl text-white/80">
            Get your free API key and start extracting web data in minutes.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-[#FF3000] hover:bg-gray-100 transition-all shadow-xl"
            >
              Get started free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="flex items-center gap-3 rounded-2xl border-2 border-white/30 bg-transparent px-8 py-5 text-lg font-medium text-white hover:bg-white/10 transition-all">
              Talk to sales
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Resources: ['Documentation', 'API Reference', 'Blog', 'Community'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
  };

  return (
    <footer className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF3000]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ClearPass</span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
              Compliance management for Nigerian government contractors, MDAs, and partners. Stay
              bid-ready, always.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 text-gray-400 hover:border-[#FF3000] hover:text-[#FF3000] transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                {category}
              </div>
              <div className="space-y-3">
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © 2026 ClearPass. Built for Nigerian businesses.
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-[#FF3000]" />
            <span>in Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface LandingPageProps {
  onGetStarted?: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar onGetStarted={onGetStarted} />
      <HeroSection onGetStarted={onGetStarted} />
      <LogosSection />
      <FeaturesGrid />
      <HowItWorks />
      <CodeExample />
      <Testimonials />
      <Pricing />
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

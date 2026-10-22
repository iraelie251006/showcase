import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const dir = path.resolve('content/imports/linkedin-articles/images');
const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function box(x,y,w,h,title,lines=[],color='#9e88ef') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#192039" stroke="${color}" stroke-width="2"/><text x="${x+w/2}" y="${y+38}" fill="${color}" font-size="24" font-weight="700" text-anchor="middle">${escape(title)}</text>${lines.map((line,i)=>`<text x="${x+w/2}" y="${y+72+i*28}" fill="#dde0ed" font-size="19" text-anchor="middle">${escape(line)}</text>`).join('')}`;
}
function arrow(x1,y1,x2,y2,label='') {
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#95a4c8" fill="none" stroke-width="3" marker-end="url(#arrow)"/>${label?`<text x="${(x1+x2)/2+10}" y="${(y1+y2)/2-12}" fill="#abb8d8" font-size="18">${escape(label)}</text>`:''}`;
}
function wrap(title,subtitle,body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#95a4c8"/></marker></defs><rect width="1600" height="1100" rx="24" fill="#0c1122"/><g font-family="Arial, sans-serif"><text x="70" y="76" fill="#f3f0fc" font-size="40" font-weight="700">${escape(title)}</text><text x="70" y="118" fill="#b5b9cf" font-size="22">${escape(subtitle)}</text>${body}<text x="70" y="1062" fill="#909bb8" font-size="18">Elie · Project case study · Architecture redrawn from project notes</text></g></svg>`;
}
const net = wrap('NetSentry · Shared state across app servers','Traditional deployment shown; Kubernetes work is described separately in the article.',
  box(610,160,380,105,'Browser',['Domain analysis request'])+
  arrow(800,265,800,310,'HTTPS')+
  box(540,310,520,125,'Nginx load balancer',['TLS termination · Let’s Encrypt','Round-robin routing'])+
  arrow(650,435,450,490)+arrow(950,435,1150,490)+
  box(190,490,520,125,'EC2 · Web01',['Node.js + Express','bcrypt authentication'], '#71b6eb')+
  box(890,490,520,125,'EC2 · Web02',['Node.js + Express','Same application image'], '#71b6eb')+
  arrow(450,615,640,680)+arrow(1150,615,960,680)+
  box(540,680,520,125,'Redis · Shared storage',['Sessions and application data','Both app servers read and write'], '#64c5a0')+
  arrow(190,550,95,550)+arrow(95,550,95,810)+
  box(70,810,430,140,'Security checks',['SSL Labs · VirusTotal','WhoisXML · HTTP headers · DNS'], '#e2af67')+
  box(1120,680,410,125,'Analysis result',['A+–F grade','Actionable recommendations'], '#e2af67')+
  arrow(1290,615,1290,680)+
  `<text x="540" y="895" fill="#b5b9cf" font-size="20">CI/CD: GitHub Actions → checks → Docker Hub</text><text x="540" y="930" fill="#b5b9cf" font-size="20">→ SSH deployment → health verification</text><text x="70" y="1015" fill="#b5b9cf" font-size="20">Deployment retired after the school assessment to avoid idle hosting costs.</text>`);
const dev = wrap('DevFlow · Terraform to EKS rollout','Final state backend: S3-native locking with use_lockfile = true. No DynamoDB lock table.',
  box(70,175,400,135,'Terraform workflow',['VPC · subnets · EKS','Compatible pinned provider'])+
  arrow(470,240,560,240)+
  box(560,175,430,135,'S3 remote backend',['Terraform state + native lockfile','use_lockfile = true'], '#64c5a0')+
  box(1090,175,440,135,'GitHub Actions',['Checks → build → push → deploy','Federated AWS credentials'], '#e2af67')+
  arrow(1310,310,1310,360)+
  box(1090,360,440,105,'Docker Hub',['Commit SHA + latest image tags'], '#71b6eb')+
  `<rect x="70" y="360" width="920" height="605" rx="24" fill="#111e29" stroke="#478f78" stroke-width="2"/><text x="100" y="402" fill="#82cdb3" font-size="25">AWS VPC · two availability zones</text>`+
  box(110,440,390,120,'Public load balancer',['Incoming application traffic'], '#71b6eb')+
  box(560,440,390,120,'NAT gateway',['Outbound access for private nodes'], '#71b6eb')+
  arrow(305,560,305,625,'requests')+
  box(110,625,840,180,'EKS · private managed worker nodes',['2 × t3.small · Next.js containers','devflow namespace · two replicas','Readiness probe: /api/health'], '#9e88ef')+
  arrow(1090,415,950,690,'image pull')+
  arrow(1310,465,1310,625)+
  box(1090,625,440,120,'Deployment rollout',['kubectl set image','Wait for rollout status'], '#e2af67')+
  arrow(1090,690,950,715)+
  box(110,840,840,90,'Kubernetes Secret',['Runtime app configuration'], '#64c5a0')+
  box(1090,840,440,90,'MongoDB Atlas',['External application database'], '#64c5a0')+
  arrow(950,770,1090,880)+arrow(755,625,755,560)+
  `<text x="70" y="1015" fill="#b5b9cf" font-size="20">Historical deployment case study; current availability is not asserted.</text>`);
for (const [name,svg] of [['netsentry-architecture',net],['devflow-architecture',dev]]) {
  await writeFile(path.join(dir,`${name}.svg`),svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir,`${name}.png`));
  console.log(`Rendered ${name}.png`);
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  bgColor: string;
  email: string;
  emailLabel?: string;
  phone: string;
  phoneLabel?: string;
  location: string;
  tags: string[];
  isMock?: boolean;
}

export const CRM_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Công ty Kế toán An Bình',
    initials: 'AB',
    bgColor: '#0284c7', // Sky 600
    email: 'lienhe@anbinhaccounting.vn',
    phone: '555546143786',
    phoneLabel: 'Cơ quan',
    location: 'Hà Nội, Việt Nam',
    tags: ['Quan trọng'],
    isMock: true
  },
  {
    id: '2',
    name: 'Hãng Hàng không Vietnam Airlines',
    initials: 'VA',
    bgColor: '#f59e0b', // Amber 500
    email: 'support@vietnamairlines.vn',
    phone: '1023553001',
    phoneLabel: 'Nhà riêng',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    tags: ['Khách hàng'],
    isMock: true
  },
  {
    id: '3',
    name: 'Cửa hàng Hoa Giỏ Tre',
    initials: 'GT',
    bgColor: '#e11d48', // Rose 600
    email: 'muahang@giotrehoa.vn',
    phone: '1015553001',
    phoneLabel: 'Di động',
    location: 'Đà Nẵng, Việt Nam',
    tags: [],
    isMock: true
  },
  {
    id: '4',
    name: 'Đặt Lịch Trực Tuyến Bookingly',
    initials: 'BL',
    bgColor: '#0d9488', // Teal 600
    email: 'info@bookingly.vn',
    emailLabel: 'Cơ quan',
    phone: '8123398937',
    phoneLabel: 'Cơ quan',
    location: 'Hải Phòng, Việt Nam',
    tags: ['Khách hàng', 'Tiềm năng'],
    isMock: true
  },
  {
    id: '5',
    name: 'Kênh Phát thanh Boom FM',
    initials: 'BF',
    bgColor: '#6366f1', // Indigo 500
    email: 'boomfm@radioprz.vn',
    phone: '01234111235',
    phoneLabel: 'Cơ quan',
    location: 'Cần Thơ, Việt Nam',
    tags: ['Khách hàng', 'Quan trọng'],
    isMock: true
  },
  {
    id: '6',
    name: 'Hỗ trợ Khách hàng Capsule',
    initials: 'CS',
    bgColor: '#475569', // Slate 600
    email: 'hotro@capsulecrm.vn',
    phone: '',
    location: 'Bình Dương, Việt Nam',
    tags: [],
    isMock: true
  },
  {
    id: '7',
    name: 'Sự kiện & Tiệc cưới Carlton',
    initials: 'CT',
    bgColor: '#ea580c', // Orange 600
    email: 'tieccuoi@carlton.vn',
    phone: '013458991234',
    phoneLabel: 'Cơ quan',
    location: 'Khánh Hòa, Việt Nam',
    tags: ['Nhà cung cấp'],
    isMock: true
  },
  {
    id: '8',
    name: 'Máy photo Trung tâm',
    initials: 'MT',
    bgColor: '#84cc16', // Lime 500
    email: 'hotro@mayphototrungtam.vn',
    phone: '08008894321',
    phoneLabel: 'Cơ quan',
    location: 'Bình Dương, Việt Nam',
    tags: ['Nhà cung cấp'],
    isMock: true
  },
  {
    id: '9',
    name: 'Nội thất Căn nhà Việt',
    initials: 'NV',
    bgColor: '#d946ef', // Fuchsia 500
    email: 'lienhe@noithatcannhaviet.vn',
    emailLabel: 'Cơ quan',
    phone: '07821489381',
    phoneLabel: 'Di động',
    location: 'Vũng Tàu, Việt Nam',
    tags: ['Khách hàng', 'Quan trọng'],
    isMock: true
  },
  {
    id: '10',
    name: 'Dịch vụ Mail Việt',
    initials: 'MV',
    bgColor: '#2563eb', // Blue 600
    email: 'hello@mailviet.vn',
    phone: '',
    location: 'Quảng Ninh, Việt Nam',
    tags: [],
    isMock: true
  }
];

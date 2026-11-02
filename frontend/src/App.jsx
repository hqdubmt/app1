import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, Users, Package, Search, Plus, Pencil, Trash2,
  RefreshCw, Menu, X, Boxes, CircleDollarSign, Activity, AlertCircle,
  CheckCircle2, ChevronRight
} from 'lucide-react';
import { api } from './api';

const money = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency', currency: 'VND', maximumFractionDigits: 0
}).format(Number(value || 0));

function App() {
  const [page, setPage] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [u, p] = await Promise.all([api.getUsers(), api.getProducts()]);
      setUsers(Array.isArray(u) ? u : (u?.users || u?.data || []));
      setProducts(Array.isArray(p) ? p : (p?.products || p?.data || []));
    } catch (e) {
      setError(`${e.message}. Kiểm tra Backend và các API GET /users, GET /products.`);
    } finally {
      setLoading(false);
    }
  }

  async function loadPageData() {
    setLoading(true);
    setError('');
    try {
      if (page === 'users') {
        const result = await api.getUsers();
        setUsers(Array.isArray(result) ? result : (result?.users || result?.data || []));
      }
      if (page === 'products') {
        const result = await api.getProducts();
        setProducts(Array.isArray(result) ? result : (result?.products || result?.data || []));
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadPageData(); }, [page]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  }

  async function saveRecord(form) {
    const isUser = modal.type === 'user';
    const action = modal.mode;
    const id = modal.record?.id;
    try {
      if (isUser) {
        if (action === 'create') await api.createUser({ name: form.name, email: form.email });
        else await api.updateUser(id, { name: form.name, email: form.email });
      } else {
        if (action === 'create') await api.createProduct({ name: form.name, price: Number(form.price) });
        else await api.updateProduct(id, { name: form.name, price: Number(form.price) });
      }
      setModal(null);
      await loadPageData();
      showNotice(action === 'create' ? 'Đã tạo dữ liệu thành công.' : 'Đã cập nhật dữ liệu.');
    } catch (e) { setError(e.message); }
  }

  async function deleteRecord(type, record) {
    if (!window.confirm(`Bạn chắc chắn muốn xóa ${type === 'user' ? 'người dùng' : 'sản phẩm'} "${record.name}"?`)) return;
    try {
      if (type === 'user') await api.deleteUser(record.id);
      else await api.deleteProduct(record.id);
      await loadPageData();
      showNotice('Đã xóa dữ liệu.');
    } catch (e) { setError(e.message); }
  }

  const filteredUsers = useMemo(() => users.filter(x =>
    `${x.name || ''} ${x.email || ''}`.toLowerCase().includes(search.toLowerCase())
  ), [users, search]);
  const filteredProducts = useMemo(() => products.filter(x =>
    `${x.name || ''} ${x.id || ''}`.toLowerCase().includes(search.toLowerCase())
  ), [products, search]);

  const nav = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'products', label: 'Sản phẩm', icon: Package }
  ];

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Boxes size={22}/></div><div><b>APP1</b><small>ADMIN CONSOLE</small></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X/></button></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item => <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => { setPage(item.id); setSearch(''); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{page === item.id && <ChevronRight size={16} className="nav-arrow"/>}</button>)}</nav>
      <div className="sidebar-bottom"><span className="status-dot"></span><div><b>App1 Backend</b><small>API · localhost:3003</small></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu/></button>
        <div className="breadcrumb">Workspace <span>/</span> <b>{nav.find(x => x.id === page)?.label}</b></div>
        <button className="refresh-btn" onClick={loadPageData} disabled={loading}><RefreshCw size={16} className={loading ? 'spin' : ''}/><span>Làm mới</span></button>
      </header>

      <section className="content">
        <div className="page-heading">
          <div><div className="eyebrow">APP1 MANAGEMENT</div><h1>{page === 'dashboard' ? 'Tổng quan' : page === 'users' ? 'Người dùng' : 'Sản phẩm'}</h1><p>Quản lý dữ liệu App1 từ một nơi.</p></div>
          {page !== 'dashboard' && <button className="primary-btn" onClick={() => setModal({ type: page === 'users' ? 'user' : 'product', mode: 'create' })}><Plus size={17}/> Thêm {page === 'users' ? 'người dùng' : 'sản phẩm'}</button>}
        </div>

        {error && <div className="alert error"><AlertCircle size={18}/><span>{error}</span><button onClick={() => setError('')}><X size={16}/></button></div>}
        {notice && <div className="alert success"><CheckCircle2 size={18}/>{notice}</div>}

        {page === 'dashboard' && <Dashboard users={users} products={products} loading={loading} onUsers={() => setPage('users')} onProducts={() => setPage('products')} onRefresh={loadAll}/>}
        {page === 'users' && <DataPanel title="Danh sách người dùng" count={filteredUsers.length} search={search} setSearch={setSearch} loading={loading} empty="Chưa có người dùng. Hãy thêm người dùng đầu tiên." onAdd={() => setModal({ type: 'user', mode: 'create' })}>
          <table><thead><tr><th>ID</th><th>HỌ TÊN</th><th>EMAIL</th><th className="right">THAO TÁC</th></tr></thead><tbody>
            {filteredUsers.map(row => <tr key={row.id}><td><span className="id-tag">#{row.id}</span></td><td><div className="person"><div className="avatar">{(row.name || 'U').charAt(0).toUpperCase()}</div><b>{row.name}</b></div></td><td className="muted">{row.email}</td><td className="right"><RowActions onEdit={() => setModal({ type: 'user', mode: 'edit', record: row })} onDelete={() => deleteRecord('user', row)}/></td></tr>)}
          </tbody></table>
        </DataPanel>}
        {page === 'products' && <DataPanel title="Danh sách sản phẩm" count={filteredProducts.length} search={search} setSearch={setSearch} loading={loading} empty="Chưa có sản phẩm. Hãy thêm sản phẩm đầu tiên." onAdd={() => setModal({ type: 'product', mode: 'create' })}>
          <table><thead><tr><th>ID</th><th>TÊN SẢN PHẨM</th><th>GIÁ</th><th className="right">THAO TÁC</th></tr></thead><tbody>
            {filteredProducts.map(row => <tr key={row.id}><td><span className="id-tag">#{row.id}</span></td><td><div className="person"><div className="product-icon"><Package size={17}/></div><b>{row.name}</b></div></td><td className="price">{money(row.price)}</td><td className="right"><RowActions onEdit={() => setModal({ type: 'product', mode: 'edit', record: row })} onDelete={() => deleteRecord('product', row)}/></td></tr>)}
          </tbody></table>
        </DataPanel>}
      </section>
      <footer>APP1 ADMIN <span>•</span> React + Express + PostgreSQL</footer>
    </main>

    {modal && <RecordModal modal={modal} onClose={() => setModal(null)} onSave={saveRecord}/>}
  </div>;
}

function Dashboard({ users, products, loading, onUsers, onProducts, onRefresh }) {
  return <div className="dashboard">
    <div className="welcome-card"><div><div className="eyebrow light">CONTROL CENTER</div><h2>Chào mừng đến với App1</h2><p>Theo dõi và quản lý người dùng, sản phẩm trong hệ thống.</p><button className="light-btn" onClick={onRefresh}><RefreshCw size={16}/> Cập nhật dữ liệu</button></div><div className="welcome-art"><div className="art-ring ring-one"></div><div className="art-ring ring-two"></div><Boxes size={66}/></div></div>
    <div className="stat-grid">
      <StatCard icon={Users} label="Tổng người dùng" value={loading ? '—' : users.length} note="Dữ liệu từ API /users" tone="blue"/>
      <StatCard icon={Package} label="Tổng sản phẩm" value={loading ? '—' : products.length} note="Dữ liệu từ API /products" tone="purple"/>
      <StatCard icon={Activity} label="Trạng thái ứng dụng" value="API" note="Kết nối qua Backend" tone="green"/>
    </div>
    <div className="quick-grid">
      <button className="quick-card" onClick={onUsers}><div className="quick-icon blue-bg"><Users/></div><div><b>Quản lý người dùng</b><small>Xem, thêm, sửa và xóa tài khoản</small></div><ChevronRight/></button>
      <button className="quick-card" onClick={onProducts}><div className="quick-icon purple-bg"><Package/></div><div><b>Quản lý sản phẩm</b><small>Xem, thêm, sửa và xóa sản phẩm</small></div><ChevronRight/></button>
    </div>
  </div>;
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
}

function DataPanel({ title, count, search, setSearch, loading, empty, onAdd, children }) {
  const hasRows = count > 0;
  return <div className="data-panel"><div className="panel-head"><div><h2>{title}</h2><span>{count} bản ghi</span></div><div className="table-tools"><div className="search-box"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..."/></div><button className="small-add" onClick={onAdd}><Plus size={16}/><span>Thêm mới</span></button></div></div>
    {loading ? <div className="loading-state"><RefreshCw className="spin"/> Đang tải dữ liệu...</div> : hasRows ? <div className="table-wrap">{children}</div> : <div className="empty-state"><div className="empty-icon"><Package size={25}/></div><b>{empty}</b><span>Kiểm tra kết nối Backend hoặc tạo dữ liệu mới.</span></div>}
  </div>;
}

function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button title="Sửa" onClick={onEdit}><Pencil size={16}/></button><button title="Xóa" className="delete-action" onClick={onDelete}><Trash2 size={16}/></button></div>;
}

function RecordModal({ modal, onClose, onSave }) {
  const record = modal.record || {};
  const [name, setName] = useState(record.name || '');
  const [email, setEmail] = useState(record.email || '');
  const [price, setPrice] = useState(record.price ?? '');
  const [busy, setBusy] = useState(false);
  const isUser = modal.type === 'user';
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    await onSave({ name: name.trim(), email: email.trim(), price });
    setBusy(false);
  }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><form className="modal" onSubmit={submit}>
    <div className="modal-head"><div><div className="eyebrow">APP1 DATA</div><h2>{modal.mode === 'create' ? 'Thêm mới' : 'Chỉnh sửa'} {isUser ? 'người dùng' : 'sản phẩm'}</h2></div><button type="button" className="icon-btn" onClick={onClose}><X/></button></div>
    <label>Tên {isUser ? 'người dùng' : 'sản phẩm'}<input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder={isUser ? 'Ví dụ: Nguyễn Văn An' : 'Ví dụ: Laptop Dell'}/></label>
    {isUser ? <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"/></label> : <label>Giá (VND)<input type="number" min="0" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} placeholder="15000000"/></label>}
    <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Hủy</button><button className="primary-btn" disabled={busy}>{busy ? 'Đang lưu...' : 'Lưu dữ liệu'}</button></div>
  </form></div>;
}

export default App;

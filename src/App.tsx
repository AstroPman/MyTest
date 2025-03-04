import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, MoreHorizontal, FileEdit, Trash2, Eye, Filter } from 'lucide-react';

// User型の変更
interface User {
  id: string;
  salon_id: number;
  name: string;
  img: string;
  style: string;
  salon_name: string;
  score: number;
  reviews: number;
  skr: number;
  hj: number;
  f: number;
  nn: number;
  ns: number;
}

interface Filters {
  id: string[];
  salon_id: string[];
  name: string[];
  img: string[];
  style: string[];
  salon_name: string[];
  score: string[];
  reviews: string[];
  skr: string[];
  hj: string[];
  f: string[];
  nn: string[];
  ns: string[];
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Filters>({
    id: [],
    salon_id: [],
    name: [],
    img: [],
    style: [],
    salon_name: [],
    score: [],
    reviews: [],
    skr: [],
    hj: [],
    f: [],
    nn: [],
    ns: []
  });
  const [activeFilterColumn, setActiveFilterColumn] = useState<keyof User | null>(null);
  const [uniqueValues, setUniqueValues] = useState<Record<keyof User, string[]>>({
    id: [],
    salon_id: [],
    name: [],
    img: [],
    style: [],
    salon_name: [],
    score: [],
    reviews: [],
    skr: [],
    hj: [],
    f: [],
    nn: [],
    ns: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(import.meta.env.BASE_URL + 'data.json');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setUsers(data.users);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique values for each column
  useEffect(() => {
    if (users.length === 0) return;

    const extractUniqueValues = () => {
      const values: Record<keyof User, Set<string>> = {
        id: new Set(),
        salon_id: new Set(),
        name: new Set(),
        img: new Set(),
        style: new Set(),
        salon_name: new Set(),
        score: new Set(),
        reviews: new Set(),
        skr: new Set(),
        hj: new Set(),
        f: new Set(),
        nn: new Set(),
        ns: new Set()
      };

      users.forEach(user => {
        values.id.add(user.id);
        values.salon_id.add(user.salon_id?.toString() || '');
        values.name.add(user.name);
        values.img.add(user.img);
        values.style.add(user.style);
        values.salon_name.add(user.salon_name);
        values.score.add(user.score?.toString() || '');
        values.reviews.add(user.reviews?.toString() || '');
        values.skr.add(user.skr?.toString() || '');
        values.hj.add(user.hj?.toString() || '');
        values.f.add(user.f?.toString() || '');
        values.nn.add(user.nn?.toString() || '');
        values.ns.add(user.ns?.toString() || '');
      });

      const result: Record<keyof User, string[]> = {
        id: Array.from(values.id),
        salon_id: Array.from(values.salon_id),
        name: Array.from(values.name).sort(),
        img: Array.from(values.img),
        style: Array.from(values.style),
        salon_name: Array.from(values.salon_name).sort(),
        score: Array.from(values.score).sort(),
        reviews: Array.from(values.reviews).sort(),
        skr: Array.from(values.skr).sort(),
        hj: Array.from(values.hj).sort(),
        f: Array.from(values.f).sort(),
        nn: Array.from(values.nn).sort(),
        ns: Array.from(values.ns).sort()
      };

      setUniqueValues(result);
    };

    extractUniqueValues();
  }, [users]);

  // Toggle filter value
  const toggleFilter = (column: keyof User, value: string) => {
    setFilters(prev => {
      const columnFilters = prev[column as keyof Filters] as string[];
      const newFilters = columnFilters.includes(value)
        ? columnFilters.filter(v => v !== value)
        : [...columnFilters, value];
      
      return {
        ...prev,
        [column]: newFilters
      };
    });
  };

  // Clear filters for a column
  const clearFilters = (column: keyof User) => {
    setFilters(prev => ({
      ...prev,
      [column]: []
    }));
  };

  // Check if a filter is active for a column
  const isFilterActive = (column: keyof User) => {
    return filters[column].length > 0;
  };

  // Sort and filter users
  const filteredUsers = users
    .filter(user => {
      // Text search filter
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.salon_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Column filters
      const matchesColumnFilters = Object.keys(filters).every(column => {
        const columnFilters = filters[column as keyof Filters];
        return columnFilters.length === 0 || columnFilters.includes(user[column as keyof User] as string);
      });
      
      return matchesSearch && matchesColumnFilters;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate the paginated users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = (column: keyof User) => {
    setActiveFilterColumn(activeFilterColumn === column ? null : column);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: boolean }) => {
    const badgeClass = status ? 'bg-success' : 'bg-secondary';
    const statusText = status ? 'True' : 'False';

    return <span className={`badge ${badgeClass}`}>{statusText}</span>;
};

// Filter dropdown component
const FilterDropdown = ({ column }: { column: keyof User }) => {
  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const values = uniqueValues[column].filter(value =>
    value.toLowerCase().includes(filterSearchTerm.toLowerCase())
  );
  const columnFilters = filters[column];
  const hasActiveFilters = columnFilters.length > 0;

  return (
    <div className="dropdown-menu shadow-sm border-0 p-0">
      <div className="p-2 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-medium">フィルター</span>
          {hasActiveFilters && (
            <button 
              className="btn btn-sm btn-link text-decoration-none p-0 text-muted" 
              onClick={(e) => {
                e.stopPropagation();
                clearFilters(column);
              }}
            >
              クリア
            </button>
          )}
        </div>
        <div className="input-group input-group-sm">
          <input 
            type="text" 
            className="form-control form-control-sm" 
            placeholder="検索..." 
            value={filterSearchTerm}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setFilterSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-auto" style={{ maxHeight: '250px' }}>
        <div className="list-group list-group-flush">
          {values.map(value => (
            <label 
              key={value} 
              className="list-group-item list-group-item-action border-0 d-flex align-items-center px-3 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={columnFilters.includes(value)}
                onChange={() => toggleFilter(column, value)}
              />
              <span className="text-truncate">{value}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid py-5 bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-fluid py-5 bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">エラーが発生しました</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">ページを再読み込みするか、後でもう一度お試しください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <div className="row align-items-center">
                <div className="col">
                  <h5 className="mb-0 fw-bold">ユーザー管理</h5>
                </div>
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-nowrap">プロフィール</th>
                      <th className="px-4 py-3 text-nowrap">
                        <div className="d-flex align-items-center">
                          <div 
                            className="cursor-pointer d-flex align-items-center me-2"
                            onClick={() => handleSort('id')}
                          >
                            ID
                            {sortField === 'id' && (
                              <ArrowUpDown size={16} className="ms-1" />
                            )}
                          </div>
                          <div className="dropdown">
                            <button 
                              className={`btn btn-sm p-0 ${isFilterActive('id') ? 'text-primary' : 'text-muted'}`}
                              onClick={() => toggleFilterDropdown('id')}
                            >
                              <Filter size={14} />
                            </button>
                            {activeFilterColumn === 'id' && (
                              <FilterDropdown column="id" />
                            )}
                          </div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-nowrap">
                        <div className="d-flex align-items-center">
                          <div 
                            className="cursor-pointer d-flex align-items-center me-2"
                            onClick={() => handleSort('salon_id')}
                          >
                            サロンID
                            {sortField === 'salon_id' && (
                              <ArrowUpDown size={16} className="ms-1" />
                            )}
                          </div>
                          <div className="dropdown">
                            <button 
                              className={`btn btn-sm p-0 ${isFilterActive('salon_id') ? 'text-primary' : 'text-muted'}`}
                              onClick={() => toggleFilterDropdown('salon_id')}
                            >
                              <Filter size={14} />
                            </button>
                            {activeFilterColumn === 'salon_id' && (
                              <FilterDropdown column="salon_id" />
                            )}
                          </div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-nowrap">
                        <div className="d-flex align-items-center">
                          <div 
                            className="cursor-pointer d-flex align-items-center me-2"
                            onClick={() => handleSort('name')}
                          >
                            名前
                            {sortField === 'name' && (
                              <ArrowUpDown size={16} className="ms-1" />
                            )}
                          </div>
                          <div className="dropdown">
                            <button 
                              className={`btn btn-sm p-0 ${isFilterActive('name') ? 'text-primary' : 'text-muted'}`}
                              onClick={() => toggleFilterDropdown('name')}
                            >
                              <Filter size={14} />
                            </button>
                            {activeFilterColumn === 'name' && (
                              <FilterDropdown column="name" />
                            )}
                          </div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-nowrap">サロン名</th>
                      <th className="px-4 py-3 text-nowrap">スタイル</th>
                      <th className="px-4 py-3 text-nowrap">スコア</th>
                      <th className="px-4 py-3 text-nowrap">レビュー</th>
                      <th className="px-4 py-3 text-nowrap">SKR</th>
                      <th className="px-4 py-3 text-nowrap">HJ</th>
                      <th className="px-4 py-3 text-nowrap">F</th>
                      <th className="px-4 py-3 text-nowrap">NN</th>
                      <th className="px-4 py-3 text-nowrap">NS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map(user => (
                      <tr key={user.id}>
                        <td className="px-4 py-3">
                          <img 
                            src={user.img}
                            alt={`${user.name}のプロフィール画像`} 
                            className="rounded-circle" 
                            width="40" 
                            height="40"
                            onError={(e) => {
                              // Fallback for broken images
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 fw-medium">
                          <a href={`https://men-esthe.jp/therapist.php?id=${user.id}`} target="_blank" rel="noopener noreferrer">
                            {user.id}
                          </a>
                        </td>
                        <td className="px-4 py-3 fw-medium">{user.salon_id}</td>
                        <td className="px-4 py-3 fw-medium">{user.name}</td>
                        <td className="px-4 py-3">{user.salon_name}</td>
                        <td className="px-4 py-3">{user.style}</td>
                        <td className="px-4 py-3">{user.score}</td>
                        <td className="px-4 py-3">{user.reviews}</td>
                        <td className="px-4 py-3">{user.skr}</td>
                        <td className="px-4 py-3">{user.hj}</td>
                        <td className="px-4 py-3">{user.f}</td>
                        <td className="px-4 py-3">{user.nn}</td>
                        <td className="px-4 py-3">{user.ns}</td>
                      </tr>
                    ))}
                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                          データが見つかりませんでした
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white py-3">
              <div className="row align-items-center">
                <div className="col">
                  <p className="mb-0 text-muted small">全 {users.length} 件中 {filteredUsers.length} 件表示</p>
                </div>
                <div className="col-auto">
                  <nav aria-label="Page navigation">
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>前へ</button>
                      </li>
                      {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === Math.ceil(filteredUsers.length / itemsPerPage) ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>次へ</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


import React, { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

// User型の定義
interface User {
  id: number;
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
  age: number; // 追加
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<string>('');
  const [sortField, setSortField] = useState<keyof User>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [reviewFilter, setReviewFilter] = useState<string>('');
  const [reviewFilterValue, setReviewFilterValue] = useState<number>(0);

  // JSONファイルからデータを取得
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

  // ユニークなサロン名を取得
  const uniqueSalons = Array.from(new Set(users.map(user => user.salon_name)));

  // サロン名でフィルタリング
  let filteredUsers = selectedSalon
    ? users.filter(user => user.salon_name === selectedSalon)
    : users;

  // reviewsでフィルタリング
  if (reviewFilter && reviewFilterValue) {
    filteredUsers = filteredUsers.filter(user => {
      switch (reviewFilter) {
        case '>':
          return user.reviews > reviewFilterValue;
        case '<':
          return user.reviews < reviewFilterValue;
        case '=':
          return user.reviews === reviewFilterValue;
        case '>=':
          return user.reviews >= reviewFilterValue;
        case '<=':
          return user.reviews <= reviewFilterValue;
        default:
          return true;
      }
    });
  }

  // ソート処理
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // ソートフィールドの変更
  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // ローディング状態
  if (loading) {
    return (
      <div className="container-fluid py-5 bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    );
  }

  // エラー状態
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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">ユーザー管理</h5>
                <div className="d-flex align-items-center">
                  <select
                    className="form-select w-auto me-2"
                    value={selectedSalon}
                    onChange={(e) => setSelectedSalon(e.target.value)}
                  >
                    <option value="">全てのサロン</option>
                    {uniqueSalons.map(salon => (
                      <option key={salon} value={salon}>{salon}</option>
                    ))}
                  </select>
                  <select
                    className="form-select w-auto me-2"
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                  >
                    <option value="">レビュー数フィルター</option>
                    <option value="&gt;">&gt;</option>
                    <option value="&lt;">&lt;</option>
                    <option value="=">=</option>
                    <option value="&gt;=">&gt;=</option>
                    <option value="&lt;=">&lt;=</option>
                  </select>
                  <input
                    type="number"
                    className="form-control w-auto"
                    value={reviewFilterValue}
                    onChange={(e) => setReviewFilterValue(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-nowrap">プロフィール</th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('id')}>
                        ID
                        {sortField === 'id' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('salon_id')}>
                        サロンID
                        {sortField === 'salon_id' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap">名前</th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('age')}>
                        年齢
                        {sortField === 'age' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap">サロン名</th>
                      <th className="px-4 py-3 text-nowrap">スタイル</th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('score')}>
                        スコア
                        {sortField === 'score' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('reviews')}>
                        レビュー
                        {sortField === 'reviews' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('skr')}>
                        SKR
                        {sortField === 'skr' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('hj')}>
                        HJ
                        {sortField === 'hj' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('f')}>
                        F
                        {sortField === 'f' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('nn')}>
                        NN
                        {sortField === 'nn' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                      <th className="px-4 py-3 text-nowrap cursor-pointer" onClick={() => handleSort('ns')}>
                        NS
                        {sortField === 'ns' && <ArrowUpDown size={16} className="ms-1" />}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map(user => (
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
                        <td className="px-4 py-3 fw-medium">{user.age}</td>
                        <td className="px-4 py-3">{user.salon_name}</td>
                        <td className="px-4 py-3">{user.style}</td>
                        <td className="px-4 py-3">{user.score}</td>
                        <td className="px-4 py-3">{user.reviews}</td>
                        <td className="px-4 py-3">{user.skr}%</td>
                        <td className="px-4 py-3">{user.hj}%</td>
                        <td className="px-4 py-3">{user.f}%</td>
                        <td className="px-4 py-3">{user.nn}%</td>
                        <td className="px-4 py-3">{user.ns}%</td>
                      </tr>
                    ))}
                    {sortedUsers.length === 0 && (
                      <tr>
                        <td colSpan={14} className="text-center py-4 text-muted">
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
                  <p className="mb-0 text-muted small">全 {sortedUsers.length} 件表示</p>
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

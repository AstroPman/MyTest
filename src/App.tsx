import React, { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import './App.css'; // 追加
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'; // 追加
import { Modal, Button, Dropdown, DropdownButton } from 'react-bootstrap'; // 変更

// User型の定義
interface User {
  id: number;
  salon_id: number;
  name: string;
  img: string;
  age: number;
  height: number;
  bra_size: string;
  bust: number;
  waist: number;
  hip: number;
  salon_name: string;
  score: number;
  reviews: number;
  skr: number;
  hj: number;
  f: number;
  nn: number;
  ns: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<string>(''); // 変更
  const [sortField, setSortField] = useState<keyof User>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [reviewFilter, setReviewFilter] = useState<string>(''); // 変更
  const [reviewFilterValue, setReviewFilterValue] = useState<number | ''>(''); // 変更
  const [itemsPerPage, setItemsPerPage] = useState<number>(25); // 追加
  const [currentPage, setCurrentPage] = useState<number>(1); // 追加
  const [scoreRange, setScoreRange] = useState<[number | '', number | '']>(['', '']); // 変更
  const [selectedBraSizes, setSelectedBraSizes] = useState<string[]>([]); // 変更
  const [showModal, setShowModal] = useState(false); // 追加
  const [showDropdown, setShowDropdown] = useState(false); // 追加

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

  // スコアの色を決定する関数
  const getScoreClass = (score: number) => {
    if (score >= 90) return 'very-high';
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  // ユニークなサロン名を取得
  const uniqueSalons = Array.from(new Set(users.map(user => user.salon_name)));
  const braSizes = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A~Z

  // サロン名でフィルタリング
  let filteredUsers = selectedSalon
    ? users.filter(user => user.salon_name === selectedSalon)
    : users;

  // reviewsでフィルタリング
  if (reviewFilter && reviewFilterValue !== '') {
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

  // スコアでフィルタリング
  if (scoreRange[0] !== '' && scoreRange[1] !== '') {
    filteredUsers = filteredUsers.filter(user => user.score >= scoreRange[0] && user.score <= scoreRange[1]);
  }

  // カップ数でフィルタリング
  if (selectedBraSizes.length > 0) {
    filteredUsers = filteredUsers.filter(user => selectedBraSizes.includes(user.bra_size));
  }

  // ソート処理
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // ページネーション処理
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              フィルターを設定
            </Button>
            <DropdownButton id="dropdown-basic-button" title="並べ替え">
              <Dropdown.Item onClick={() => handleSort('score')}>スコア {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('reviews')}>レビュー数 {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('age')}>年齢 {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('height')}>身長 {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('nn')}>NN {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('ns')}>NS {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('skr')}>SKR {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('hj')}>HJ {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSort('f')}>F {sortDirection === 'asc' ? '▲' : '▼'}</Dropdown.Item>
            </DropdownButton>
          </div>
          <div className="d-flex flex-wrap justify-content-center">
            {paginatedUsers.map(user => (
              <div 
                key={user.id} 
                className="card glass-card m-3" 
                style={{ width: '18rem' }} 
                onClick={() => window.open(`https://men-esthe.jp/therapist.php?id=${user.id}`, '_blank')}
              >
                <div className="card-img-container">
                  <img 
                    src={user.img} 
                    alt={`${user.name}のプロフィール画像`} 
                    className="card-img-top" 
                    onError={(e) => {
                      // Fallback for broken images
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="card-img-overlay">
                    <div className="card-text-container">
                      <h5 className="card-title">
                        {user.name}
                        <span className="age">({user.age})</span>
                      </h5>
                      <p className="card-text salon-name">{user.salon_name}</p>
                      <p className="card-text">T{user.height}/{user.bust}({user.bra_size})/{user.waist}/{user.hip}</p>
                      <div className="d-flex align-items-end justify-content-center">
                        <p className={`card-text score`} data-score={getScoreClass(user.score)}>
                          {user.score}
                          <span className="review-count">({user.reviews})</span>
                        </p>
                      </div>
                      <div className="service-grid">
                        <div className="service-item">NN: {user.nn}%</div>
                        <div className="service-item">NS: {user.ns}%</div>
                        <div className="service-item">F: {user.f}%</div>
                        <div className="service-item">SKR: {user.skr}%</div>
                        <div className="service-item">HJ: {user.hj}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {
            paginatedUsers.length === 0 && (
              <div className="text-center py-4 text-muted">
                データが見つかりませんでした
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>前へ</button>
                </li>
                {[...Array(Math.ceil(sortedUsers.length / itemsPerPage)).keys()].map(page => (
                  <li key={page} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page + 1)}>{page + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === Math.ceil(sortedUsers.length / itemsPerPage) ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>次へ</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* フィルターモーダル */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>フィルター設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">サロン名</label>
            <select
              className="form-select"
              value={selectedSalon}
              onChange={(e) => setSelectedSalon(e.target.value)}
            >
              <option value="">全てのサロン</option>
              {uniqueSalons.map(salon => (
                <option key={salon} value={salon}>{salon}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">スコア範囲</label>
            <div className="d-flex align-items-center">
              <input
                type="number"
                className="form-control w-auto"
                min="0"
                max="100"
                value={scoreRange[0]}
                onChange={(e) => setScoreRange([e.target.value === '' ? '' : Number(e.target.value), scoreRange[1]])}
              />
              <span className="mx-2">-</span>
              <input
                type="number"
                className="form-control w-auto"
                min="0"
                max="100"
                value={scoreRange[1]}
                onChange={(e) => setScoreRange([scoreRange[0], e.target.value === '' ? '' : Number(e.target.value)])}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">レビュー数</label>
            <div className="d-flex align-items-center">
              <input
                type="number"
                className="form-control w-auto"
                min="0"
                value={reviewFilterValue}
                onChange={(e) => setReviewFilterValue(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <select
                className="form-select w-auto ms-2"
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
              >
                <option value="">選択</option>
                <option value=">">以上</option>
                <option value="<">以下</option>
                <option value="=">等しい</option>
                <option value=">=">以上</option>
                <option value="<=">以下</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">カップ数</label>
            <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
              <Dropdown.Toggle id="dropdown-basic-button">
                カップ数を選択
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {braSizes.map(size => (
                  <Dropdown.Item 
                    key={size} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBraSizes(prev => 
                        prev.includes(size) 
                          ? prev.filter(s => s !== size) 
                          : [...prev, size]
                      );
                    }}
                  >
                    {selectedBraSizes.includes(size) && <span>&#10003; </span>}
                    {size}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            閉じる
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            適用
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;

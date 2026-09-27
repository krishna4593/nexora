import { useEffect, useState } from 'react';
import { noticeService } from '../../../services/notice.service';

const RecentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await noticeService.getNotices({ limit: 5, sort: '-publishAt' });
        if (res.success) {
          setNotices(res.data);
        } else {
          setError('Failed to load recent notices');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading recent notices');
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-surface-container-low rounded-xl animate-pulse">
        Loading recent notices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error-container/20 border border-error/30 rounded-xl text-error">
        {error}
      </div>
    );
  }

  if (notices.length === 0) {
    return null; // No recent notices to show
  }

  return (
    <section className="pt-4">
      <h3 className="text-sm font-label-md font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">campaign</span>
        Recent Notices
      </h3>
      <div className="space-y-3">
        {notices.map((notice) => (
          <div key={notice._id} className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-4">
            <h4 className="font-headline-sm font-semibold text-on-surface mb-1 line-clamp-1">
              {notice.title}
            </h4>
            <p className="text-sm text-on-surface-variant line-clamp-2">
              {notice.content}
            </p>
            <div className="text-xs text-on-surface-variant mt-2">
              {new Date(notice.publishAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentNotices;

import { format } from 'date-fns';

const NoticeTable = ({
  notices,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onToggleStatus
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-outline-variant/30">
      <table className="min-w-full table-auto">
        <thead className="bg-surface-container-lowest">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-on-surface-variant">Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-on-surface-variant">Audience</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-on-surface-variant">Priority</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-on-surface-variant">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-on-surface-variant">Published At</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-on-surface-variant">Expires At</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice._id} className="border-t border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
              <td className="px-4 py-2 text-sm text-on-surface font-medium">{notice.title}</td>
              <td className="px-4 py-2 text-sm text-on-surface-variant">{notice.audience}</td>
              <td className="px-4 py-2 text-sm text-on-surface-variant capitalize">{notice.priority}</td>
              <td className="px-4 py-2 text-sm text-on-surface-variant capitalize">
                {notice.isPublished ? 'Published' : 'Draft'}{!notice.isActive && ' (Inactive)'}
              </td>
              <td className="px-4 py-2 text-sm text-on-surface-variant">
                {notice.publishedAt ? format(new Date(notice.publishedAt), 'PPP') : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-on-surface-variant">
                {notice.expiresAt ? format(new Date(notice.expiresAt), 'PPP') : '-'}
              </td>
              <td className="px-4 py-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => onEdit(notice)}
                  className="p-1 text-primary hover:bg-primary/10 rounded"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button
                  onClick={() => onDelete(notice)}
                  className="p-1 text-error hover:bg-error/10 rounded"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
                {notice.isPublished ? (
                  <button
                    onClick={() => onUnpublish(notice._id)}
                    className="p-1 text-warning hover:bg-warning/10 rounded"
                  >
                    <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onPublish(notice._id)}
                    className="p-1 text-success hover:bg-success/10 rounded"
                  >
                    <span className="material-symbols-outlined text-[20px]">publish</span>
                  </button>
                )}
                <button
                  onClick={() => onToggleStatus(notice._id)}
                  className="p-1 text-on-surface hover:bg-outline/10 rounded"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {notice.isActive ? 'toggle_on' : 'toggle_off'}
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoticeTable;

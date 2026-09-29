import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function LessonViewPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await api.get(`/lessons/${id}`);
        setLesson(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading) return <main className="page-shell"><div className="panel-card loading-panel">Loading lesson...</div></main>;
  if (error) return <main className="page-shell"><div className="panel-card error-panel"><p>{error}</p></div></main>;
  if (!lesson) return null;

  return (
    <main className="page-shell lesson-page-shell">
      <article className="panel-card lesson-card">
        <div className="lesson-cover" style={{ backgroundImage: 'linear-gradient(135deg, rgba(79,70,229,0.35), rgba(15,23,42,0.25)), url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80)' }} />

        <div className="lesson-content">
          <span className="section-tag">Lesson</span>
          <h1>{lesson.title}</h1>
          <p className="meta-line"><strong>Duration:</strong> {lesson.duration || 0} mins</p>

          {lesson.videoUrl && (
            <div className="video-shell">
              <video controls src={lesson.videoUrl} />
            </div>
          )}

          <div
            className="lesson-body"
            dangerouslySetInnerHTML={{ __html: lesson.content || '<p>Lesson content is not available yet.</p>' }}
          />
        </div>
      </article>
    </main>
  );
}

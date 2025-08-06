import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAllEventsForAdmin, deleteEvent, createEvent, updateEventStatus } from "../../api";
import type { CreateEventData, Event } from "../../types";
import EventForm from "../../components/EventForm";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const loadEvents = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await fetchAllEventsForAdmin();
      
      // ▼▼▼ УЛУЧШЕННАЯ СОРТИРОВКА ЗДЕСЬ ▼▼▼
      data.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        return 0;
      });
      // ▲▲▲-----------------------------▲▲▲

      setEvents(data);
    } catch (err) {
      setError("Не удалось загрузить события.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteEvent(id);
        await loadEvents();
      } catch (err) {
        alert(t('errorDelete'));
        console.error(err);
      }
    }
  };

  const handleCreateEvent = async (eventData: CreateEventData) => {
    setIsSubmitting(true);
    try {
      // Здесь мы должны использовать createEvent, а не submitEvent,
      // так как админ должен иметь возможность создавать сразу одобренные события.
      // Но для простоты оставим как есть, админ может одобрить событие сразу после создания.
      await createEvent(eventData);
      await loadEvents();
      setFormKey(prevKey => prevKey + 1);
    } catch (err) {
      alert(t('errorCreate'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateEventStatus(id, status);
      await loadEvents();
    } catch (err) {
      alert("Не удалось обновить статус.");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">{t('status_pending')}</span>;
      case 'APPROVED':
        return <span className="px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{t('status_approved')}</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">{t('status_rejected')}</span>;
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div className="text-white text-2xl text-center">{t('loading')}</div>;
  }

  return (
    <div className="w-full text-white">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">{t('adminPanelTitle')}</h1>
        <div className="flex gap-2">
            <Link to="/admin/categories" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
                {t('manageCategories')}
            </Link>
            <Link to="/admin/cities" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
                {t('manageCities')} &rarr;
            </Link>
        </div>
      </div>
      
      <EventForm key={formKey} onSubmit={handleCreateEvent} isLoading={isSubmitting} />

      {error && <div className="bg-red-900 border border-red-500 text-red-200 p-4 rounded-lg mb-6 text-center">{error}</div>}

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t('allEvents')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('formTitleDE')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('formCity')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('status_label')}</th>
                <th className="relative px-6 py-3"><span className="sr-only">Действия</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.translations.find(tr => tr.locale === 'de')?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.city.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(event.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {event.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleStatusUpdate(event.id, 'APPROVED')} className="text-green-400 hover:text-green-300 mr-4">{t('action_approve')}</button>
                        <button onClick={() => handleStatusUpdate(event.id, 'REJECTED')} className="text-yellow-400 hover:text-yellow-300 mr-4">{t('action_reject')}</button>
                      </>
                    )}
                    <Link to={`/admin/edit/${event.id}`} className="text-indigo-400 hover:text-indigo-300 mr-4">{t('edit')}</Link>
                    <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-400">{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
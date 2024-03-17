import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Favourate({ session }) {
    const [loading, setLoading] = useState(true)
    const [favourate, setFavourate] = useState(null)

    useEffect(() => {
        let ignore = false
        async function getFavourates() {
          setLoading(true)
          const { user } = session
    
          const { data, error } = await supabase
            .from('user_favourates')
            .select(`user_id, podcast_id`)
            .eq('user_id', user.id)
            .single()
    
          if (!ignore) {
            if (error) {
              console.warn(error)
            } else if (data) {
              setFavourate(data.podcast_id)
            }
          }
    
          setLoading(false)
        }
    
        getFavourates()
    
        return () => {
          ignore = true
        }
      }, [session])

    async function updateFavourate(event) {
        event.preventDefault()

        setLoading(true)
        const { user } = session

        const updates = {
        user_id: user.id,
        podcast_id: favourate,
        created_at: new Date(),
        }

        const { error } = await supabase.from('user_favourates').upsert(updates)

        if (error) {
            alert(error.message)
        } else {
            setFavourate(favourate)
        }
        setLoading(false)
    }

    return (
        <form onSubmit={updateFavourate} className="form-widget">
            <div>
            <label htmlFor="podcast_id">Podcast</label>
            <input
                id="podcast_id"
                type="text"
                required
                value={favourate || ''}
                onChange={(e) => setFavourate(e.target.value)}
            />
            </div>
            <div>
            <button className="button block primary" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Update'}
            </button>
            </div>
        </form>
    )
}
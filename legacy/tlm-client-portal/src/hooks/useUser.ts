import {useEffect, useState} from "react";
import {User, BARE_USER_ENTRY} from "tlm-common";
import * as api from "../services/api";

export const useUser = (id: string) => {
  const [ user, setUser ] = useState<User>(BARE_USER_ENTRY);
  const [ loading, setLoading ] = useState(false);

  async function load(){
    setLoading(true);
    const c = await api.users.getUser(id) as User;
    setUser(c);
    setLoading(false);
  }

  useEffect(()=>{
    if (id && id!=='new') {
      load();
    }
  }, [id]);

  return { user, loading, setUser, reload: load }
}

import { useState } from 'react';
import { signupUser } from '../../shared/api';

export default function Login() {
  const [data, setData] = useState({ phone: '', password: '' });
  const [token, setToken] = useState('');
  const [loader, setLoader] = useState(false);
  const onSubmit = async () => {
    setLoader(true);
    try {
      const res = await signupUser(data);
      setToken(res.token);
    } catch (err: any) {
      setToken(err!.response!.data!.message || err!.response!.data!.error);
    }
    setLoader(false);
  };
  return (
    <div>
      <section className="flex justify-center items-center h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white rounded p-6 space-y-4">
          <div className="mb-4">
            <p className="text-gray-600">Sign In</p>
            <h2 className="text-xl font-bold">Join BezoMoney</h2>
          </div>
          <div>
            <input
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="text"
              placeholder="Phone"
              value={data.phone}
              onChange={(e) => {
                setData({ ...data, phone: e.target.value });
              }}
            />
          </div>
          <div>
            <input
              className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
            />
          </div>
          <div>
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200"
              onClick={onSubmit}
              disabled={loader}
            >
              {loader ? 'Loading' : 'Register'}
            </button>
          </div>
          <div>{token && <p className="break-words">{token}</p>}</div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)

  const [filter, setFilter] = useState({ name: "", limit: 10, after: btoa(encodeURIComponent(0)), sort: "" });
  const [paging, setPaging] = useState({ total: 0, currPage: 1, limit: filter.limit });

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController();
    const newFilter = Object.entries(filter).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {})
    const params = new URLSearchParams(newFilter).toString();

    console.log(params);

    fetch(`https://api.hubapi.com/cms/v3/hubdb/tables/5399910/rows?portalId=21427242&${params}`).then(res => res.json())
      .then(res => {
        console.log(res)
        setUsers(res.results)
      }).catch(err => {
        setError(err)
      })

    return () => controller.abort();
  }, [filter])

  const RowsPerPage = (e) => {
    console.log(e.target.value);
    setFilter({
      ...filter,
      limit: e.target.value,
      after: btoa(encodeURIComponent(0))
    })
  }

  console.log(filter);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="m-8 p-8 bg-white rounded-[20px] shadow-md border">
        <div className="flex justify-between">
          <label className="text-gray-500 text-sm">
            <span>Show</span>
            <select name="items_per_page" id="items_per_page" className="rounded py-1 mx-2 text-sm pr-8 border-gray-300 focus:outline-none" onChange={e => RowsPerPage(e)} >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </label>
          <label className="text-gray-500 text-sm">
            <span>Search:</span>
            <input
              type="text"
              className="rounded py-1 mx-2 text-sm focus:outline-none border-gray-300"
              onChange={(e) => setFilter({ ...filter, name: e.target.value, after: btoa(encodeURIComponent(0)) })}
            />
          </label>
        </div>
        <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative mt-4">
          <thead>
            <tr className="text-left">
              <th className="sticky top-0 border-b text-center border-gray-200 px-6 py-2 text-gray-500 font-bold text-xs userId" width={50}>
                ID
              </th>
              <th className="sticky top-0 border-b text-center border-gray-200 px-6 py-2 text-gray-500 font-bold text-xs avtar">
                Avtar
              </th>
              <th className="sticky top-0 border-b text-center border-gray-200 px-6 py-2 text-gray-500 font-bold text-xs firstName">
                Name
              </th>
              <th className="sticky top-0 border-b text-center border-gray-200 px-6 py-2 text-gray-500 font-bold text-xs emailAddress">
                Email
              </th>
              <th className="sticky top-0 border-b text-center border-gray-200 px-6 py-2 text-gray-500 font-bold text-xs country">
                Country
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => {
                const { firstname, lastname, email, avtar, country } = user.values;
                return (
                  <tr key={user.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="border-collapse border-y border-gray-200 px-6">{user.id}</td>
                    <td className="border-collapse border-y border-gray-200 avtar">
                      <span className="text-gray-700 px-6 py-1 flex items-center"><img className="rounded-xl shadow-xl" src={avtar} alt={firstname + ' ' + lastname} width={60} loading="lazy" /></span>
                    </td>
                    <td className="border-collapse border-y border-gray-200 firstName">
                      <span className="text-gray-700 px-6 py-1 flex items-center">{firstname} {lastname}</span>
                    </td>
                    <td className="border-collapse border-y border-gray-200 emailAddress">
                      <span className="text-gray-700 px-6 py-1 flex items-center">{email}</span>
                    </td>
                    <td className="border-collapse border-y border-gray-200 country">
                      <span className="text-gray-700 px-6 py-1 flex items-center">{country}</span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* <Pagination paging={paging} action={{ filter, setFilter }} /> */}
      </div>
    </div>
  )
}

import { LoadingCircle } from "@renderer/components/ui/loading"
import { useAuthQuery } from "@renderer/hooks/common"
import { isASCII } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import { useMemo } from "react"

import { RecommendationCard } from "./recommendations-card"

export function Recommendations() {
  const rsshubPopular = useAuthQuery(
    Queries.discover.rsshubCategory({
      category: "popular",
    }),
    {
      meta: {
        persist: true,
      },
    },
  )

  const { data } = rsshubPopular

  const keys = useMemo(() => {
    if (data) {
      return Object.keys(data).sort((a, b) => {
        const aname = data[a].name
        const bname = data[b].name

        const aRouteName = data[a].routes[Object.keys(data[a].routes)[0]].name
        const bRouteName = data[b].routes[Object.keys(data[b].routes)[0]].name

        const ia = isASCII(aname) && isASCII(aRouteName)
        const ib = isASCII(bname) && isASCII(bRouteName)

        if (ia && ib) {
          return aname.toLowerCase() < bname.toLowerCase() ? -1 : 1
        } else if (ia || ib) {
          return ia > ib ? -1 : 1
        } else {
          return 0
        }
      })
    } else {
      return []
    }
  }, [data])

  if (rsshubPopular.isLoading) {
    return <LoadingCircle className="mt-16" size="medium" />
  }

  if (!data) {
    return null
  }

  return (
    <div className="mt-8">
      <div className="text-center text-lg font-bold">Popular</div>

      <div className="mt-4 grid grid-cols-3 gap-4 px-3">
        {keys.map((key) => (
          <RecommendationCard key={key} data={data[key]} routePrefix={key} />
        ))}
      </div>
    </div>
  )
}

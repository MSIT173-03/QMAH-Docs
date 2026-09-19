// 可重建的說明圖；箭頭表示操作順序，不表示資料庫外鍵
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const diagrams = [
  ['asset-adjustment-flow', '管理員增加兩把鑰匙', [
    ['輸入操作', '會員、鑰匙、增加 2 把、活動補發原因'],
    ['驗證條件', '登入管理員 ID／原因／啟用鑰匙／餘額範圍'],
    ['同一交易保存', 'UserKeyBalances：3 → 5', 'KeyTransactions：+2、原因、管理員 ID'],
    ['提交並回傳', '成功才顯示新餘額；未提交則回復'],
    ['查帳', '背包查數量；流水查來源；AuditLogs 查管理操作']
  ]],
  ['asset-ledger-map', '資產紀錄：每張表回答什麼', [
    ['現在有多少', 'PointBalances／UserKeyBalances／KeyProgressBalances'],
    ['何時、為何加扣', 'PointTransactions／KeyTransactions／KeyProgressTransactions', 'Amount、Reason、ReferenceType、ReferenceId'],
    ['哪張券、誰發或撤銷', 'UserCoupons：IssuedAt／ExpiresAt／Status', 'IssuedByAdminUserId／RevokedByAdminUserId'],
    ['哪次批次活動', 'EconomyAdjustmentBatches：篩選條件、管理員、結果', '券以 GrantBatchId／RevokeBatchId 回查'],
    ['管理員從哪裡操作', 'AuditLogs：操作者、Controller、Action、HTTP 結果']
  ]]
]
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
for (const [name, title, rows] of diagrams) {
  const cells = rows.map(([label, ...lines], i) => {
    const id = `step-${i}`
    const value = esc([label, ...lines].join('<br>'))
    const box = `<mxCell id="${id}" value="${value}" style="rounded=1;whiteSpace=wrap;html=1;fontFamily=Microsoft JhengHei;fontSize=18;fontColor=#243b40;fillColor=#eef5f3;strokeColor=#6b9494;spacing=12;" vertex="1" parent="1"><mxGeometry x="20" y="${100+i*150}" width="640" height="110" as="geometry"/></mxCell>`
    const edge = name.endsWith('flow') && i < rows.length - 1 ? `<mxCell id="edge-${i}" value="" source="${id}" target="step-${i+1}" edge="1" parent="1" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;strokeColor=#3f7074;exitX=0.5;exitY=1;entryX=0.5;entryY=0;"><mxGeometry relative="1" as="geometry"/></mxCell>` : ''
    return box + edge
  }).join('')
  const xml = `<mxfile host="drawio"><diagram id="${name}" name="${title}"><mxGraphModel background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="heading" value="${title}" style="text;html=1;fontFamily=Microsoft JhengHei;fontSize=26;fontStyle=1;fontColor=#243b40;" vertex="1" parent="1"><mxGeometry x="20" y="20" width="640" height="50" as="geometry"/></mxCell>${cells}</root></mxGraphModel></diagram></mxfile>`
  writeFileSync(fileURLToPath(new URL(`${name}.drawio`, import.meta.url)), xml)
}

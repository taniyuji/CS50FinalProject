プロジェクトタイトル：Urchin_survivor
YoutubeURL：https://www.youtube.com/watch?v=XHxJZ7HeplE
概要：2Dアクションゲーム
使用言語：python, javascript, HTML&CSS
使用ライブラリ、技術：flask, sqlite3, jquery,

ゲーム概要詳細
敵の攻撃をうまく避けながら、落下攻撃でできるだけ多くの敵を倒していく2Dアクションゲームです。
地面を移動している時は通常状態、ジャンプして最高到達点に到達してから落下するまでがトゲトゲの落下攻撃状態になります。
ライフは３つで、通常状態で的に当たったり、敵が発射してくる弾丸に当たるたびに１つ消費していき、全て失うとゲームオーバーです。

操作説明
「右、左矢印キー」：横移動
壁にくっついた状態で「上矢印キー」：壁を登る
天井に着いた状態で「上矢印＋左右矢印キー」：天井を移動
「スペースキー」：ジャンプ
壁にくっついた状態（上矢印キーを押した状態）で「スペースキー」：壁ジャンプ
天井に着いた状態（上矢印キーを押した状態）で「スペースキー」：シューティングスターアタック

技術、実装詳細
使用しているhtmlファイルは主に「index.html」と「ranking.html」の２つで、「index.html」の方でタイトルやゲーム、ランキング登録までを担う主なwebページになります。
「ranking.html」はゲームオーバー後にランキングを登録した際に自動的にリダイレクトされます。（詳細は後ほど）

ゲームの動きやポップアップ画面は全てjavascriptで実装しており、画像やテキストをキャンバス内で操作しています。
主に「Canvasの動きや更新を操作するスクリプト」「プレイヤーを動かすスクリプト」「敵を動かすスクリプト２種類」「キー入力を受け取るスクリプト」「プレイヤーのHPを管理
するスクリプト」「ランキング画面をポップアップさせるスクリプト」「スコアを管理するスクリプト」「ステージ配置を管理するスクリプト」の８つのスクリプトに分けられています。
プレイヤーや敵の動作やプレイヤーのHPの監視などマイフレーム呼び出したい処理を「キャンバスを操作スクリプト」に集結させて、window.requestAnimationFrame()を使用することで１つの毎フレーム
描画処理の中で一括で全ての動きを更新できるよう意識して設計しております。
スクリプトの分け方については、htmlファイルにあらかじめ紐付けたスクリプトを参照しなければいけない点から、あまりに切り分けすぎると作業効率もhtmlファイルの可読性も落ちてしまうと考え、明らかに
分ける必要があるものやゲーム構造的に分けた方が便利といったものを区別してスクリプトを分割することを心がけました。
例えば、Inputを受け取る処理はいろいろなタイトル画面やプレイヤーの操作といった複数のスクリプトにわたって使用されることが想像できたため、inputを受け取る処理を１つのスクリプトにまとめて、その
結果を返すだけのスクリプトとして切り離してモジュールとして外部から参照できるようにしてあげることで、キー入力を受け取る処理の記述を単純化させることができました。また、キー番号をenumを使用して
そのキーの名称と結びつけて外部からはキー番号ではなくその名称を選択して処理を選択できるようにさせることで、カプセル化ができるよう意識しました。

スクリプ間の参照にはimportフレームワークを使用しており、そうすることで簡単な操作で他のjsスクリプトのメソッドや変数にアクセスすることが可能になっています。また、その利便性の他にもFlask
環境で実行する上で他のスクリプトを参照するにはこの方法が一番理解しやすく、扱いやすかった点もありました。ただ難点として、参照するファイルを増やすたびにindex.htmlファイルに紐付けなければなら
ない点や直接スクリプトを指定して参照していることでインスタンス化がしづらい点などの問題点があり、何よりかなり致命的だったのが、Flask環境を一度ローカルサーバー上で起動してしまうと画像やスクリプトが
webページの動作軽量化のために自動でキャッシュされてしまい、その結果新しくFlask環境を立ち上げても画像やスクリプトが更新されず、「Flask run」をするたびにwebページのキャッシュ情報を削除し
なければならなかったことでした。flask runするたびにファイル名の後ろにその日の日時を新たに書き加えることで、webサーバーに同じファイルをキャッシュさせていないと錯覚させてFlaskRun毎に常に最新の
キャッシュを持たせる対処法なども見つけましたが、ここで弊害になったのがimport使用で、importで使用するにはjsファイル名をハードコーディングする必要があり、日付が加えられた状態のファイルを動的に
指摘することができないのです。この問題が私を大きく悩ませ、結局のところその２つを解決する時間の余裕がないと感じ、設計上のわかりやすさを優先してimportの使用を続行し、cash問題の解決を諦めて、
デバック効率を捨てる方向となりました。

またゲームオーバー後にはポップアップ画面が表示され、ランキング登録ができるようにも実装しています。
「ランキング画面をポップアップさせるスクリプト」にて、プレイヤーのライフが0以下になることを条件としてランキング登録画面が現れる仕組みです。こちらはjqueryのpopup機能を使用いたしました。
そして、ランキング登録ポップアップの提出ボタンが押下されると、POSTメソッドで入力された名前とスコアがpython側に渡され、python側は受け取った値をsqliteを使用して、データベースに新たに
登録しています。そして登録したのちに新しくなったテーブルのデータを全て抽出し、次のhtmlファイルに私てランキングとして表示させています。
ここの処理関して、本来はjavascriptで計算したスコアを直接python側に送りたかったのですが、htmlのformとpost以外でデータをどうやってpythonに送ればいいかがわからず、ググっても目立った対処法
を見出すことができませんでした。そこでjavascriptとpythonの橋渡し役をindex.htmlに担ってもらうことでこの問題に対処いたしました。具体的には、まずindex.html側でinputタグとそれを示す
idを持った要素を用意します。ただ、そのままだとたとえそのinputタグに情報を渡したとしても、ユーザー側が書き換えることができてしまうので、この要素のtypeをhiddenにすることでindex.html上
に描写させないようにしました。そうすることで、scoreを保持しているjavascript側は安心してindex.html側のそのinputタグに情報を渡すことができ、その後javascriptから入手したスコアをユーザ
が入力した名前と一緒にpostメソッドに載せることでpython側に伝達させることができました。









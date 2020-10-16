def decoration(t)
    em_and_strong = false
    now_strong = false
    now_em = false
    now_code = false
    now_s = false
    while t.match(/\[[^!\[\]\(\)]*\]\([^!\[\]\(\)]*\)/)
      about_link = t.match(/\[([^!\[\]\(\)]*)\]\(([^!\[\]\(\)]*)\)/)
      t = t.sub(/\[[^!\[\]\(\)]*\]\([^!\[\]\(\)]*\)/, "<a href=\"#{about_link[2]}\" target=\"_blank\">#{about_link[1]}</a>")
    end
    while t.match(/\*{3}/)
      if em_and_strong
        t = t.sub("***", "</em></strong>")
        em_and_strong = false
      else
        t = t.sub("***", "<em><strong>")
        em_and_strong = true
      end
    end
    while t.match(/\*{2}/)
      if now_strong
        t = t.sub("**", "</strong>")
        now_strong = false
      else
        t = t.sub("**", "<strong>")
        now_strong = true
      end
    end
    while t.match(/\*{1}/)
      if now_em
        t = t.sub("*", "</em>")
        now_em = false
      else
        t = t.sub("*", "<em>")
        now_em = true
      end
    end
    while t.match(/\`/)
      if now_code
        t = t.sub("`", "</code>")
        now_code = false
      else
        t = t.sub("`", "<code class='lm-c'>")
        now_code = true
      end
    end
    return t
  end
  
  def render_markdown(t)
    print("\e[1m")
    print("\e[32m")
    puts "[Render Markdown Engine] "
    print("\e[31m")
    p "We started render the markdown code."
    print("\e[0m")
    t = t.gsub("<", "&lt;").gsub(">", "&gt;")
    cs = t.split("\n")
    rs = ""
    now_code = false
    cs.each do |e|
      if now_code != true
        case e
        when /^#\s/
          e = e.sub("# ", "<h1>") + "</h1>"
          rs += e
        when /^\#{2}\s/
          e = e.sub("## ", "<h2>") + "</h2>"
          rs += e
        when /^\#{3}\s/
          e = e.sub("### ", "<h3>") + "</h3>"
          rs += e
        when /^\#{4}\s/
          e = e.sub("#### ", "<h4>") + "</h4>"
          rs += e
        when /^\#{5}\s/
          e = e.sub("##### ", "<h5>") + "</h5>"
          rs += e
        when /^\#{6}\s/
          e = e.sub("###### ", "<h6>") + "</h6>"
          rs += e
        when /^\`{3}/
          if e.start_with?("``` ")
            lang = e.split(" ")[1]
            e = "<pre><code class=\"#{lang}\">"
          else
            e = "<pre><code>"
          end
          now_code = true
          rs += e
        when /^\-{5}/
          e = "<hr>"
          rs += e
        when /^:::message/
          e = "<div class=\"md-message\""
          rs += e
        when /^:::comment/
        when /^!\[.*\]\(.*\)/
          about_img = e.match(/!\[(.*)\]\((.*)\)/)
          e = "<img src=\"#{about_img[2]}\" loading=\"lazy\" alt=\"#{about_img[1]}\">"
          rs += e
        when /^@youtube\s/
          yt_es = e.split(" ")
          e = "<div class=\"iframe-youtube\"><iframe loading=\"lazy\" width=\"100%\" height=\"56.85%\" src=\"https://www.youtube.com/embed/#{yt_es[1]}\" frameborder=\"0\" allowfullscreen></iframe></div>"
          rs += e
        when /^@twitter\s/
          tw_es = e.split(" ")
          tw_id = tw_es[1].sub(/https:\/\/twitter.com\/.*\//, "")
          tw_iframe_url = "https://platform.twitter.com/embed/index.html?dnt=false&embedId=twitter-widget-1&frame=false&hideCard=false&hideThread=false&id=#{tw_id}&lang=jawidgetsVersion=ed20a2b%3A1601588405575&width=550px"
          tw_ele = "<div class=\"iframe-twitter\"><iframe loading=\"lazy\" src=\"#{iframe_url}\" frameborder=\"0\" scrolling=\"no\"></iframe></div>"
          rs += tw_ele
        when /&gt;* .*/
          content = e.split(" ", 2)[1]
          quote_n = e.split(" ")[0].scan("&gt;").length
          bq_start = "<blockquote><p>" * quote_n
          bq_end = "</blockquote></p>" * quote_n
          puts bq_start
          e = bq_start + content + bq_end
          rs += e
        else
          rs += decoration(e) + "<br>"
        end
      elsif now_code == true && e.start_with?("```")
        now_code = false
        rs += "</code></pre>"
      else
        rs += "<div>" + e + "</div>"
      end
    end
    print("\e[1m")
    print("\e[32m")
    puts "[Render Markdown Engine] "
    print("\e[34m")
    p "We finished render the markdown code."
    print("\e[0m")
    return rs
  end
  
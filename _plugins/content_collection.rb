module Data_Model
  class Generator < Jekyll::Generator
    safe true
    priority :highest

    def generate(site)
      for report in site.data['oversight-reports']
        for item in report['related']
          cc = item['content-collection']
          slug = item['slug']
          if cc
            collection = site.data[cc]
            if not collection
              raise "Unknown content-collection for '#{slug}': '#{cc}'"
            end
            related_item = nil
            for candidate in collection
              if candidate['slug'] == slug
                related_item = candidate
                break
              end
            end
            if not related_item
              raise "Unable to find item in '#{cc}.yml' with slug '#{slug}'"
            end
            item['item'] = related_item
          end
        end
      end
    end
  end
end

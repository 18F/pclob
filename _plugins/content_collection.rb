module Data_Model
  class Generator < Jekyll::Generator
    safe true
    priority :highest

    def get_related_item(site, collection_name, slug)
      collection = site.data[collection_name]
      if not collection
        raise "Unknown content-collection '#{collection_name}' for '#{slug}'"
      end
      related_item = nil
      for candidate in collection
        if candidate['slug'] == slug
          related_item = candidate
          break
        end
      end
      if not related_item
        raise ("Unable to find item in #{collection_name}.yml " +
               "with slug '#{slug}'")
      end
      related_item
    end

    def generate(site)
      source = 'oversight-reports'
      for report in site.data[source]
        for item in report['related']
          collection_name = item['content-collection']
          if collection_name
            begin
              item['item'] = get_related_item(site, collection_name,
                                              item['slug'])
            rescue RuntimeError => e
              raise "#{e} (encountered when processing #{source}.yml)"
            end
          end
        end
      end
    end
  end
end

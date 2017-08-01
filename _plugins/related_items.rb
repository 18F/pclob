module Data_Model
  class Generator < Jekyll::Generator
    safe true
    priority :highest

    def relate_one_to_many(site, from, from_key, to, to_key)
      for from_item in site.data[from]
        from_slug = from_item['slug']
        to_slug = from_item[from_key]
        continue unless to_slug
        to_item = nil
        for candidate in site.data[to]
          if candidate['slug'] == to_slug
            to_item = candidate
            break
          end
        end
        if not to_item
          raise "In #{from}.yml, #{from_key} of #{from_slug} is " \
                "#{to_slug}, which does not match a slug in #{to}.yml"
        end
        from_item[from_key] = to_item
        if not to_item[to_key]
          to_item[to_key] = []
        end
        to_item[to_key] << from_item
      end
    end

    def generate(site)
      relate_one_to_many(site,
                         'statements', 'related-oversight-report',
                         'oversight-reports', 'related-statements')
    end
  end
end
